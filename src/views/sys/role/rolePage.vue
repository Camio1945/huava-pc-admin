<template>
  <div class="role-list">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['/sys/role/create']" type="primary" @click="handleAdd">
          <template #icon>
            <icon name="el-icon-Plus" />
          </template>
          新增
        </el-button>
      </div>
      <div class="mt-4" v-loading="pager.loading">
        <div>
          <el-table :data="pager.list" size="large">
            <el-table-column prop="name" label="名称" min-width="150" />
            <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
            <el-table-column prop="sort" label="排序" min-width="100" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  v-perms="['/sys/role/update']"
                  @click="handleEdit(row)"
                  v-if="row.id != 1"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="primary"
                  v-perms="['/sys/role/update']"
                  @click="handleAuth(row)"
                  v-if="row.id != 1"
                >
                  分配权限
                </el-button>
                <el-button
                  v-perms="['/sys/role/delete']"
                  link
                  type="danger"
                  @click="handleDelete(row.id)"
                  v-if="row.id != 1"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex justify-end mt-4">
          <pagination v-model="pager" @change="getPage" />
        </div>
      </div>
    </el-card>
    <edit-popup v-if="showEdit" ref="editRef" @success="getPage" @close="showEdit = false" />
    <auth-popup v-if="showAuth" ref="authRef" @success="getPage" @close="showAuth = false" />
  </div>
</template>

<script lang="ts" setup name="role">
import { rolePage, roleDelete } from '@/api/perms/role'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './roleForm.vue'
import AuthPopup from './auth.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const authRef = shallowRef<InstanceType<typeof AuthPopup>>()
const showEdit = ref(false)
const showAuth = ref(false)
const { pager, getPage } = usePaging({
  fetchFun: rolePage
})
const handleAdd = async () => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}

const handleEdit = async (data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.setFormData(data)
}

const handleAuth = async (data: any) => {
  showAuth.value = true
  await nextTick()
  authRef.value?.open()
  authRef.value?.setFormData(data)
}

// 删除角色
const handleDelete = async (id: number) => {
  await feedback.confirm('确定要删除？')
  await roleDelete({ id })
  getPage()
}

getPage()
</script>
