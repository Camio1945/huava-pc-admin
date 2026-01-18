import request from '@/utils/request'

// 角色列表
export function rolePage(params: any) {
  return request.get({ url: '/sys/role/page', params })
}

// 角色列表全部
export function roleAll(params: any) {
  return request.get({ url: '/sys/role/all', params })
}

/** 名称是否已经存在 */
export function isNameExists(id: string, name: string) {
  return request.get({ url: `/sys/role/isNameExists`, params: { id, name } })
}

// 添加角色
export function roleAdd(data: any) {
  return request.post({ url: '/sys/role/create', data })
}

// 编辑角色
export function roleEdit(data: any) {
  return request.put({ url: '/sys/role/update', data })
}

// 设置权限
export function setPerm(data: any) {
  return request.post({ url: '/sys/role/setPerm', data })
}

// 获取权限
export function getPerm(id: string) {
  return request.get({ url: '/sys/role/getPerm/' + id })
}

// 删除角色
export function roleDelete(data: any) {
  return request.delete({ url: '/sys/role/delete', data })
}

// 角色详情
export function roleDetail(params: any) {
  return request.get({ url: '/sys/role/detail', params })
}
