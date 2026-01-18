import request from '@/utils/request'

// 配置
export function getConfig() {
  // return request.get({ url: '/config/getConfig' })
  // TODO: 这里应该返回真实的配置信息
  return new Promise((resolve) => {
    resolve({
      oss_domain: 'https://php.likeadmin.cn/',
      web_name: '后台管理',
      web_favicon: '',
      web_logo: '',
      login_image: '/login_image.png',
      copyright_config: [
        {
          key: '京ICP备15033382号-6',
          value: 'https://beian.miit.gov.cn'
        }
      ]
    })
  })
}

// 工作台主页
export function getWorkbench() {
  return request.get({ url: '/workbench/index' })
}

//字典数据
export function getDictData(params: any) {
  return request.get({ url: '/config/dict', params })
}
