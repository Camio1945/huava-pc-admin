import request from '@/utils/request'

// 管理员列表
export function adminPage(params: any) {
  return request.get({ url: '/sys/user/page', params }, { ignoreCancelToken: true })
}

// 管理员列表全部
export function adminAll(params: any) {
  return request.get({ url: '/sys/user/all', params })
}

// 管理员添加
export function adminAdd(data: any) {
  return request.post({ url: '/sys/user/create', data })
}

// 管理员编辑
export function adminEdit(data: any) {
  return request.put({ url: '/sys/user/update', data })
}

// 管理员删除
export function adminDelete(data: any) {
  return request.delete({ url: '/sys/user/delete', data })
}

// 管理员详情
export function adminDetail(params: any) {
  return request.get({ url: '/sys/user/get/' + params.id })
}

/** 用户名是否已经存在 */
export function isUsernameExists(neId: string, username: string) {
  return request.get({ url: '/sys/user/isUsernameExists', params: { neId, username } })
}
