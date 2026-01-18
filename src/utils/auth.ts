import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/enums/cacheEnums'
import { resetRouter } from '@/router'
import useTabsStore from '@/stores/modules/multipleTabs'
import useUserStore from '@/stores/modules/user'
import cache from './cache'

export function getToken() {
  return cache.get(TOKEN_KEY)
}

export function getRefreshToken() {
  return cache.get(REFRESH_TOKEN_KEY)
}

export function clearAuthInfo() {
  const userStore = useUserStore()
  const tabsStore = useTabsStore()
  userStore.resetState()
  tabsStore.resetState()
  cache.remove(TOKEN_KEY)
  cache.remove(REFRESH_TOKEN_KEY)
  resetRouter()
}
