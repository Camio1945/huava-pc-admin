<template>
  <div class="login flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <div class="login-card flex rounded-md">
        <div class="flex-1 h-full hidden md:inline-block">
          <image-contain :src="config.login_image" :width="400" height="100%" />
        </div>
        <div
          class="login-form bg-body flex flex-col justify-center px-10 py-10 md:w-[400px] w-[375px] flex-none mx-auto"
        >
          <div class="text-center text-3xl font-medium mb-8">{{ config.web_name }}</div>
          <el-form ref="formRef" :model="formData" size="large" :rules="rules">
            <el-form-item prop="username">
              <el-input v-model="formData.username" placeholder="请输入用户名" @keyup.enter="handleEnter">
                <template #prepend>
                  <icon name="el-icon-User" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                ref="passwordRef"
                v-model="formData.password"
                show-password
                placeholder="请输入密码"
                @keyup.enter="handleLogin"
              >
                <template #prepend>
                  <icon name="el-icon-Lock" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="captchaCode" style="display: flex">
              <el-input
                ref="captchaCodeRef"
                v-model="formData.captchaCode"
                placeholder="请输入验证码"
                @keyup.enter="handleLogin"
                style="width: calc(100% - 100px)"
              >
              </el-input>
              <img
                :src="captchaUrl"
                style="width: 100px; height: 40px; cursor: pointer"
                @click="refreshCaptcha"
                alt="点击刷新验证码"
              />
            </el-form-item>
          </el-form>
          <div class="mb-5">
            <el-checkbox v-model="remAccount" label="记住用户名"></el-checkbox>
          </div>
          <el-button type="primary" size="large" :loading="isLock" @click="lockLogin"> 登录</el-button>
        </div>
      </div>
    </div>
    <layout-footer />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
import type { InputInstance, FormInstance } from 'element-plus'
import LayoutFooter from '@/layout/components/footer.vue'
import useAppStore from '@/stores/modules/app'
import useUserStore from '@/stores/modules/user'
import cache from '@/utils/cache'
import { USERNAME_KEY } from '@/enums/cacheEnums'
import { PageEnum } from '@/enums/pageEnum'
import { useLockFn } from '@/hooks/useLockFn'
import staticConfig from '@/config'

const passwordRef = shallowRef<InputInstance>()
const formRef = shallowRef<FormInstance>()
const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const remAccount = ref(false)
const config = computed(() => appStore.config)
const formData = reactive({
  username: 'admin',
  password: '123456',
  captchaCode: '0000',
  isCaptchaDisabledForTesting: true
})

const captchaUrl = ref(staticConfig.baseUrl + 'captcha')
const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['blur']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur']
    }
  ],
  captchaCode: [
    {
      required: true,
      message: '请输入验证码',
      trigger: ['blur']
    }
  ]
}
// 回车按键监听
const handleEnter = () => {
  if (!formData.password) {
    return passwordRef.value?.focus()
  }
  handleLogin()
}
// 登录处理
const handleLogin = async () => {
  await formRef.value?.validate()
  // 记住用户名，缓存
  cache.set(USERNAME_KEY, {
    remember: remAccount.value,
    username: remAccount.value ? formData.username : ''
  })
  await userStore.login(formData)
  const {
    query: { redirect }
  } = route
  const path = typeof redirect === 'string' ? redirect : PageEnum.INDEX
  router.push(path)
}
const { isLock, lockFn: lockLogin } = useLockFn(handleLogin)

// 刷新验证码
const refreshCaptcha = () => {
  // 添加时间戳参数防止浏览器缓存
  captchaUrl.value = `${staticConfig.baseUrl}captcha?t=${Date.now()}`
}

onMounted(() => {
  const value = cache.get(USERNAME_KEY)
  if (value?.remember) {
    remAccount.value = value.remember
    formData.username = value.username
  }
})
</script>

<style lang="scss" scoped>
.login {
  background-image: url('./images/login_bg.png');
  @apply min-h-screen bg-no-repeat bg-center bg-cover;
  .login-card {
    height: 400px;
  }
}
</style>
