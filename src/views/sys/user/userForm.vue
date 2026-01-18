<template>
  <div class="edit-popup">
    <popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
      <el-form ref="formRef" :model="formData" label-width="84px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input id="username" v-model="formData.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <el-upload
            id="avatar"
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img :src="avatarUrl || '/upload.png'" class="avatar" alt="" width="100" height="100" />
          </el-upload>
        </el-form-item>

        <el-form-item label="姓名" prop="realName">
          <el-input id="realName" v-model="formData.realName" placeholder="请输入姓名" clearable />
        </el-form-item>

        <el-form-item label="手机号" prop="phoneNumber">
          <el-input
            id="phoneNumber"
            class="ls-input"
            v-model="formData.phoneNumber"
            placeholder="请输入手机号"
            maxlength="20"
            clearable
          />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select id="roleIds" v-model="formData.roleIds" class="flex-1" multiple placeholder="请选择角色" clearable>
            <el-option v-for="(item, index) in roles" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="修改密码" prop="isUpdatingPassword" v-if="mode === 'edit'">
          <el-radio-group id="isUpdatingPassword" v-model="isUpdatingPassword">
            <el-radio :label="true">使用新密码</el-radio>
            <el-radio :label="false">不修改密码</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="密码" prop="password" v-if="mode === 'add' || isUpdatingPassword">
          <el-input id="password" v-model="formData.password" show-password clearable placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="是否启用">
          <el-switch id="isEnabled" v-model="formData.isEnabled" :active-value="true" :inactive-value="false" />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { adminAdd, adminDetail, adminEdit, isUsernameExists } from '@/api/perms/user'
import { getToken } from '@/utils/auth'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑管理员' : '新增管理员'
})
const isUpdatingPassword = ref<boolean>(false)
const avatarUrl = ref<string | undefined>(undefined)
const uploadUrl = ref<string>(import.meta.env.VITE_APP_BASE_URL + '/common/attachment/upload')
const headers = ref<any>({ Authorization: 'Bearer ' + getToken() })

const formData = reactive({
  id: '',
  username: '',
  realName: '',
  phoneNumber: '',
  dept_id: [],
  jobs_id: [],
  roleIds: [],
  avatar: '',
  password: '',
  isEnabled: true,
  multipoint_login: 1
})

const roleIdValidator = (rule: object, value: string, callback: any) => {
  if (formData.roleIds.length) {
    callback()
  } else {
    callback(new Error('请选择角色'))
  }
}

const validateUsername = (rule: FormItemRule, value: string, callback: any) => {
  if (!value) {
    return callback()
  }
  isUsernameExists(formData.id, value).then((res) => {
    if (res) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
    { min: 3, max: 20, message: '用户名长度应该为 3 ~ 20 个字符', trigger: ['blur', 'change'] },
    { validator: validateUsername, trigger: 'blur' }
  ],
  roleIds: [{ required: true, validator: roleIdValidator }],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
    { min: 8, max: 20, message: '密码长度应该为 8 ~ 20 个字符', trigger: ['blur', 'change'] }
  ]
})

const handleAvatarSuccess = (res: Attachment, file: File) => {
  avatarUrl.value = import.meta.env.VITE_APP_BASE_URL + res.url
  formData.avatar = res.url
  console.log(avatarUrl.value)
  console.log(res, file)
}

const beforeAvatarUpload = (file: File) => {
  const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt512K = file.size / 1024 <= 512
  if (!isJPGorPNG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式')
  }
  if (!isLt512K) {
    ElMessage.error('上传头像图片大小不能超过 512 KB')
  }
  return isJPGorPNG && isLt512K
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  console.log('mode.value', mode.value)
  mode.value == 'edit' ? await adminEdit(formData) : await adminAdd(formData)
  popupRef.value?.close()
  emit('success')
}

const open = (type = 'add') => {
  mode.value = type
  popupRef.value?.open()
}

let roles = []

const setRoles = (rolesFromParam: any[]) => {
  roles = rolesFromParam
}

const setFormData = async (row: any) => {
  const data = await adminDetail({ id: row.id })
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key]
    }
  }
  if (data.avatar) {
    avatarUrl.value = import.meta.env.VITE_APP_BASE_URL + data.avatar
  }
}

const handleClose = () => {
  emit('close')
}

defineExpose({
  open,
  setRoles,
  setFormData
})
</script>
