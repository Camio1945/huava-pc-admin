<template>
  <div class="edit-popup">
    <popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
      <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="菜单类型" prop="type" required>
          <el-radio-group v-model="formData.type">
            <el-radio :label="MenuEnum.DIRECTORY">目录</el-radio>
            <el-radio :label="MenuEnum.MENU">菜单</el-radio>
            <el-radio :label="MenuEnum.ELEMENT">元素</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级菜单" prop="pid">
          <el-tree-select
            class="flex-1"
            v-model="formData.pid"
            :data="menuOptions"
            clearable
            node-key="id"
            :props="{
              label: 'name'
            }"
            :default-expand-all="true"
            placeholder="请选择父级菜单"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" clearable />
        </el-form-item>
        <el-form-item v-if="formData.type != MenuEnum.ELEMENT" label="菜单图标" prop="icon">
          <icon-picker class="flex-1" v-model="formData.icon" />
        </el-form-item>

        <el-form-item v-if="formData.type != MenuEnum.ELEMENT" label="路由路径" prop="paths">
          <div class="flex-1">
            <el-input v-model="formData.paths" placeholder="请输入路由路径" clearable />
            <div class="form-tips">访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头</div>
          </div>
        </el-form-item>
        <el-form-item v-if="formData.type == MenuEnum.MENU" label="组件路径" prop="component">
          <div class="flex-1">
            <el-autocomplete
              class="w-full"
              v-model="formData.component"
              :fetch-suggestions="querySearch"
              clearable
              placeholder="请输入组件路径"
            />
            <div class="form-tips">访问的组件路径，如：`user/setting`，默认在`views`目录下</div>
          </div>
        </el-form-item>
        <el-form-item label="选中菜单" prop="selected" v-if="formData.type == MenuEnum.MENU">
          <div class="flex-1">
            <el-input v-model="formData.selected" placeholder="请输入路由路径" clearable />
            <div class="form-tips">访问详情页面，编辑页面时，菜单高亮显示，如`/consumer/list`</div>
          </div>
        </el-form-item>
        <el-form-item v-if="formData.type != MenuEnum.DIRECTORY" label="接口URI" prop="uri">
          <div class="flex-1">
            <el-input v-model="formData.uri" placeholder="请输入接口URI" clearable />
            <div class="form-tips">将作为 server 端 API 验权使用，如`/sys/user/page`，请谨慎修改</div>
          </div>
        </el-form-item>
        <el-form-item v-if="formData.type == MenuEnum.MENU" label="路由参数" prop="params">
          <div>
            <div class="flex-1">
              <el-input v-model="formData.params" placeholder="请输入路由参数" clearable />
            </div>
            <div class="form-tips">访问路由的默认传递参数，如：`{"id": 1, "name": "admin"}`或`id=1&name=admin`</div>
          </div>
        </el-form-item>
        <el-form-item v-if="formData.type == MenuEnum.MENU" label="是否缓存" prop="isCache" required>
          <div>
            <el-radio-group v-model="formData.isCache">
              <el-radio :label="true">缓存</el-radio>
              <el-radio :label="false">不缓存</el-radio>
            </el-radio-group>
            <div class="form-tips">选择缓存则会被`keep-alive`缓存</div>
          </div>
        </el-form-item>
        <el-form-item v-if="formData.type != MenuEnum.ELEMENT" label="是否显示" prop="isShow" required>
          <div>
            <el-radio-group v-model="formData.isShow">
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">隐藏</el-radio>
            </el-radio-group>
            <div class="form-tips">选择隐藏则路由将不会出现在侧边栏，但仍然可以访问</div>
          </div>
        </el-form-item>
        <el-form-item v-if="formData.type != MenuEnum.ELEMENT" label="菜单状态" prop="isEnabled" required>
          <div>
            <el-radio-group v-model="formData.isEnabled">
              <el-radio :label="true">正常</el-radio>
              <el-radio :label="false">停用</el-radio>
            </el-radio-group>
            <div class="form-tips">选择停用则路由将不会出现在侧边栏，也不能被访问</div>
          </div>
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <div>
            <el-input-number v-model="formData.sort" :min="0" :max="9999" />
          </div>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { menuAll, menuEdit, menuAdd, menuDetail } from '@/api/perms/menu'
import { MenuEnum } from '@/enums/appEnums'
import Popup from '@/components/popup/index.vue'
import { getModulesKey } from '@/router'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑菜单' : '新增菜单'
})

const componentsOptions = ref(getModulesKey())
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? componentsOptions.value.filter((item) => item.toLowerCase().includes(queryString.toLowerCase()))
    : componentsOptions.value
  cb(results.map((item) => ({ value: item })))
}
const formData = reactive({
  id: '',
  //父级id
  pid: 0,
  //类型
  type: MenuEnum.DIRECTORY,
  //图标
  icon: '',
  //名称
  name: '',
  //排序号
  sort: 0,
  // 路由路径
  paths: '',
  // 接口URI
  uri: '',
  //前端组件
  component: '',
  //选中路径
  selected: '',
  //路由参数
  params: '',
  //是否缓存 0=否， 1=是
  isCache: true,
  //是否显示 0=否， 1=是
  isShow: true,
  //是否禁用 0=否， 1=是
  isEnabled: true
})

const rules = {
  pid: [
    {
      required: true,
      message: '请选择父级菜单',
      trigger: ['blur', 'change']
    }
  ],
  name: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur'
    }
  ],
  paths: [
    {
      required: true,
      message: '请输入路由地址',
      trigger: 'blur'
    }
  ],
  component: [
    {
      required: true,
      message: '请输入组件地址',
      trigger: 'blur'
    }
  ]
}
const menuOptions = ref<any[]>([])

const getMenu = async () => {
  const data: any = await menuAll(true)
  const menu: any = { id: '0', name: '顶级', children: data }
  menuOptions.value.push(menu)
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  mode.value == 'edit' ? await menuEdit(formData) : await menuAdd(formData)
  popupRef.value?.close()
  emit('success')
}

const open = (type = 'add') => {
  mode.value = type
  popupRef.value?.open()
}

const setFormData = (data: Record<any, any>) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key]
    }
  }
}

const getDetail = async (row: Record<string, any>) => {
  const data = await menuDetail({
    id: row.id
  })
  setFormData(data)
}

const handleClose = () => {
  emit('close')
}

getMenu()

defineExpose({
  open,
  setFormData,
  getDetail
})
</script>
