import { getConfig } from '@/api/app'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'

interface AppConfig {
  oss_domain: string
  web_name: string
  web_favicon: string
  web_logo: string
  login_image: string
  copyright_config: Array<{key: string, value: string}>
}

interface AppSate {
  config: AppConfig
  isMobile: boolean
  isCollapsed: boolean
  isRouteShow: boolean
}

const useAppStore = defineStore('app', {
  state: (): AppSate => {
    return {
      config: {
        oss_domain: '',
        web_name: '',
        web_favicon: '',
        web_logo: '',
        login_image: '',
        copyright_config: []
      },
      isMobile: true,
      isCollapsed: false,
      isRouteShow: true
    }
  },
  actions: {
    getImageUrl(url: string) {
      return url.indexOf('http') ? `${this.config.oss_domain}${url}` : url
    },
    getConfig() {
      return new Promise<AppConfig>((resolve, reject) => {
        getConfig()
          .then((data: unknown) => {
            this.config = data as AppConfig
            resolve(data as AppConfig)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    setMobile(value: boolean) {
      this.isMobile = value
    },
    toggleCollapsed(toggle?: boolean) {
      this.isCollapsed = toggle ?? !this.isCollapsed
    },
    refreshView() {
      this.isRouteShow = false
      nextTick(() => {
        this.isRouteShow = true
      })
    }
  }
})

export default useAppStore
