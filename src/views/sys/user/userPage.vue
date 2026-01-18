<template>
  <div class="admin">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="">
          <el-input
            v-model="formData.username"
            class="w-[160px]"
            clearable
            @keyup.enter="resetPage"
            placeholder="用户名（等于）"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="formData.realName"
            class="w-[160px]"
            clearable
            @keyup.enter="resetPage"
            placeholder="姓名（包含）"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="formData.phoneNumber"
            class="w-[160px]"
            clearable
            @keyup.enter="resetPage"
            placeholder="手机号（等于）"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
          <export-data class="ml-2.5" :fetch-fun="adminPage" :params="formData" :page-size="pager.size" v-if="false" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="pager.loading" class="mt-4 !border-none" shadow="never">
      <el-button v-perms="['/sys/user/create']" type="primary" @click="handleAdd">
        <template #icon>
          <icon name="el-icon-Plus" />
        </template>
        新增
      </el-button>
      <div class="mt-4">
        <el-table :data="pager.list" size="large">
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="realName" label="姓名" align="center" />
          <el-table-column prop="phoneNumber" label="手机号" align="center" />
          <el-table-column prop="roleNames" label="角色" align="center" />
          <el-table-column prop="isEnabled" label="是否启用" align="center">
            <template #default="scope">
              {{ scope.row.isEnabled ? '启用' : '禁用' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button v-perms="['/sys/user/update']" type="primary" link @click="handleEdit(row)" v-if="row.id != 1">
                编辑
              </el-button>
              <el-button
                v-if="row.id != 1"
                v-perms="['/sys/user/delete']"
                type="danger"
                link
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex mt-4 justify-end">
        <pagination v-model="pager" @change="getPage" />
      </div>
    </el-card>
    <edit-popup v-if="showEdit" ref="editRef" @success="getPage" @close="showEdit = false" />
  </div>
</template>

<script lang="ts" setup name="admin">
import { adminPage, adminDelete } from '@/api/perms/user'
import { rolePage } from '@/api/perms/role'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './userForm.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 表单数据
const formData = reactive({
  username: '',
  realName: '',
  phoneNumber: ''
})
const showEdit = ref(false)
const { pager, getPage, resetParams, resetPage } = usePaging({
  fetchFun: adminPage,
  params: formData
})

const roles = ref([])

const getRoleNames = (roleIds: string[]) => {
  return roleIds.map((id) => roles.value.find((item) => item.id === id).name).join(',')
}

const handleAdd = async () => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
  editRef.value?.setRoles(roles)
}

const handleEdit = async (data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.setRoles(roles)
  editRef.value?.setFormData(data)
}

const handleDelete = async (id: number) => {
  await feedback.confirm('确定要删除？')
  await adminDelete({ id })
  getPage()
}

onMounted(async () => {
  const { list } = await rolePage({ size: 500, searchCount: false })
  roles.value = list
  await getPage()
  pager.list.forEach((item) => (item.roleNames = getRoleNames(item.roleIds)))
})
</script>
