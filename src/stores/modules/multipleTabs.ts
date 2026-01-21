import { defineStore } from 'pinia'
import { isExternal } from '@/utils/validate'
import type { LocationQuery, RouteLocationNormalized, RouteParamsRaw, Router, RouteRecordName } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import { unref } from 'vue'

interface TabItem {
  name: RouteRecordName
  fullPath: string
  path: string
  title?: string
  query?: LocationQuery
  params?: RouteParamsRaw
}

interface TabsSate {
  cacheTabList: Set<string>
  tabList: TabItem[]
  tasMap: Record<string, TabItem>
  indexRouteName: RouteRecordName
}

const isCannotAddRoute = (route: RouteLocationNormalized, router: Router) => {
  const { path, meta, name } = route
  if (!path || isExternal(path)) return true
  if (meta?.hideTab) return true
  if (!router.hasRoute(name!)) return true
  return !!([PageEnum.LOGIN, PageEnum.ERROR_403] as string[]).includes(path)
}

const getComponentName = (route: RouteLocationNormalized) => {
  const matchedRoute = route.matched
  return matchedRoute[matchedRoute.length - 1]?.components?.default?.name
}

export const getRouteParams = (tabItem: TabItem) => {
  const { params, path, query } = tabItem
  return {
    params: params || {},
    path,
    query: query || {}
  }
}

const useTabsStore = defineStore('tabs', {
  state: (): TabsSate => ({
    cacheTabList: new Set(),
    tabList: [],
    tasMap: {},
    indexRouteName: ''
  }),
  getters: {
    getTabList(): TabItem[] {
      return this.tabList
    },
    getCacheTabList(): string[] {
      return Array.from(this.cacheTabList)
    }
  },
  actions: {
    setRouteName(name: RouteRecordName) {
      this.indexRouteName = name
    },
    addCache(componentName?: string) {
      if (componentName) this.cacheTabList.add(componentName)
    },
    removeCache(componentName?: string) {
      if (componentName && this.cacheTabList.has(componentName)) {
        this.cacheTabList.delete(componentName)
      }
    },
    clearCache() {
      this.cacheTabList.clear()
    },
    resetState() {
      this.cacheTabList = new Set()
      this.tabList = []
      this.tasMap = {}
      this.indexRouteName = ''
    },
    addTab(router: Router) {
      const route = unref(router.currentRoute)
      const { name, query, meta, params, fullPath, path } = route
      if (isCannotAddRoute(route, router)) return

      // 标准化 fullPath 以便进行比较以检测重复项
      const normalizedFullPath = this.normalizePathForComparison(fullPath!)
      const hasTabIndex = this.findTabIndexByNormalizedPath(normalizedFullPath, this.tabList)

      const componentName = getComponentName(route)
      // 使用原始 fullPath 作为选项卡项目以保持 UI 兼容性
      const tabItem = {
        name: name!,
        path,
        fullPath, // 保留原始 fullPath 以供 UI 使用
        title: meta?.title,
        query,
        params
      }

      if (hasTabIndex != -1) {
        // 使用当前选项卡项目更新 tasMap
        this.tasMap[fullPath] = tabItem
        // 更新列表中的现有选项卡以确保其具有最新信息
        this.tabList[hasTabIndex] = tabItem
        return
      }

      this.tasMap[fullPath] = tabItem
      if (meta?.keepAlive) {
        this.addCache(componentName)
      }

      this.tabList.push(tabItem)
    },

    // 用于路径比较的标准化方法
    normalizePathForComparison(path: string) {
      // 如果存在，移除末尾的 '?'
      let normalized = path.replace(/\?$/, '')
      // 分离路径和查询参数
      const [basePath, queryParams] = normalized.split('?')
      // 对查询参数进行排序以确保比较时的一致性
      if (queryParams) {
        const sortedQuery = queryParams.split('&').sort().join('&')
        normalized = basePath + (sortedQuery ? '?' + sortedQuery : '')
      }
      return normalized
    },

    // 使用标准化路径比较查找选项卡索引的辅助方法
    findTabIndexByNormalizedPath(normalizedPath: string, tabList: TabItem[]) {
      return tabList.findIndex((item) => this.normalizePathForComparison(item.fullPath) === normalizedPath)
    },
    removeTab(fullPath: string, router: Router) {
      const { currentRoute, push } = router
      const index = this.findTabIndexByNormalizedPath(this.normalizePathForComparison(fullPath), this.tabList)
      // 移除tab
      if (this.tabList.length > 1) {
        index !== -1 && this.tabList.splice(index, 1)
      }
      const componentName = getComponentName(currentRoute.value)
      this.removeCache(componentName)
      if (fullPath !== currentRoute.value.fullPath) {
        return
      }
      // 删除选中的tab
      let toTab: TabItem | null = null

      if (index === 0) {
        toTab = this.tabList[index]
      } else {
        toTab = this.tabList[index - 1]
      }

      const toRoute = getRouteParams(toTab)
      push(toRoute)
    },
    removeOtherTab(route: RouteLocationNormalized) {
      this.tabList = this.tabList.filter((item) => item.fullPath == route.fullPath)
      const componentName = getComponentName(route)
      this.cacheTabList.forEach((name) => {
        if (componentName !== name) {
          this.removeCache(name)
        }
      })
    },
    removeAllTab(router: Router) {
      const { push, currentRoute } = router
      const { name } = unref(currentRoute)
      if (name == this.indexRouteName) {
        this.removeOtherTab(currentRoute.value)
        return
      }
      this.tabList = []
      this.clearCache()
      push(PageEnum.INDEX)
    }
  }
})

export default useTabsStore
