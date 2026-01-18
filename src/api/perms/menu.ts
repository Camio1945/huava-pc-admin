import request from '@/utils/request'

// 全部菜单
export function menuAll(excludeElement: boolean) {
  return request.get({ url: '/sys/perm/getAll', params: { excludeElement } })
}

// 添加菜单
export function menuAdd(data: Record<string, any>) {
  return request.post({ url: '/sys/perm/create', data })
}

// 编辑菜单
export function menuEdit(data: Record<string, any>) {
  return request.put({ url: '/sys/perm/update', data })
}

// 菜单删除
export function menuDelete(data: Record<string, any>) {
  return request.delete({ url: '/sys/perm/delete', data })
}

//  菜单详情
export function menuDetail(params: Record<string, any>) {
  return request.get({ url: '/sys/perm/get/' + params.id })
}
