import { defineStore } from 'pinia'
import cache from '@/utils/cache'
import type { RouteRecordRaw } from 'vue-router'
import { getUserInfo, login, logout } from '@/api/user'
import router, { filterAsyncRoutes } from '@/router'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/enums/cacheEnums'
import { PageEnum } from '@/enums/pageEnum'
import { clearAuthInfo, getToken } from '@/utils/auth'

export interface UserState {
  token: string
  userInfo: Record<string, any>
  routes: RouteRecordRaw[]
  perms: string[]
}

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken() || '',
    // 用户信息
    userInfo: {},
    // 路由
    routes: [],
    // 权限
    perms: []
  }),
  getters: {},
  actions: {
    resetState() {
      this.token = ''
      this.userInfo = {}
      this.perms = []
    },
    login(payload: any) {
      return new Promise((resolve, reject) => {
        login(payload)
          .then((data) => {
            this.token = data.accessToken
            cache.set(TOKEN_KEY, data.accessToken)
            cache.set(REFRESH_TOKEN_KEY, data.refreshToken)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then(async (data) => {
            this.token = ''
            await router.push(PageEnum.LOGIN)
            clearAuthInfo()
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((data) => {
            this.userInfo = { username: data.username, avatar: data.avatar }
            this.perms = data.uris
            this.routes = filterAsyncRoutes(data.menu)
            localStorage.setItem('username', data.username)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})

export default useUserStore
