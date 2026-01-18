<template>
  <div class="app-tabs pl-4 flex bg-body">
    <div class="flex-1 min-w-0">
      <el-tabs
        :model-value="currentTab"
        :closable="tabsPage.length > 1"
        @tab-change="handleChange"
        @tab-remove="removeTab($event)"
      >
        <template v-for="item in tabsPage" :key="item.fullPath">
          <el-tab-pane :label="item.title" :name="item.fullPath"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <el-dropdown @command="handleCommand">
      <span class="flex items-center px-3">
        <icon :size="16" name="el-icon-arrow-down" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeCurrent">关闭当前</el-dropdown-item>
          <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
          <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
          <el-dropdown-item command="toggleFullscreen">{{ isFullscreen ? '取消全屏' : '全屏显示' }}</el-dropdown-item>
          <el-dropdown-item command="settings">主题设置</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <LayoutSetting />
  </div>
</template>

<script setup lang="ts">
import useMultipleTabs from '@/hooks/useMultipleTabs'
import { useWatchRoute } from '@/hooks/useWatchRoute'
import useTabsStore, { getRouteParams } from '@/stores/modules/multipleTabs'
import { useFullscreen } from '@vueuse/core'
const { toggle: toggleFullscreen, isFullscreen } = useFullscreen()
import useUserStore from '@/stores/modules/user'
import feedback from '@/utils/feedback'
const userStore = useUserStore()
import useSettingStore from '@/stores/modules/setting'
import LayoutSetting from '../setting/drawer.vue'

const settingStore = useSettingStore()

const router = useRouter()
const tabsStore = useTabsStore()
const { removeOtherTab, addTab, removeAllTab, removeTab, tabsPage, currentTab } = useMultipleTabs()
useWatchRoute(() => {
  addTab()
})

const handleChange = (fullPath: any) => {
  const tabItem = tabsStore.tasMap[fullPath]
  router.push(getRouteParams(tabItem))
}

const handleCommand = async (command: any) => {
  switch (command) {
    case 'closeCurrent':
      removeTab()
      break
    case 'closeOther':
      removeOtherTab()
      break
    case 'closeAll':
      removeAllTab()
      break
    case 'toggleFullscreen':
      await toggleFullscreen()
      break
    case 'logout':
      await feedback.confirm('确定退出登录吗？')
      await userStore.logout()
      break
    case 'settings':
      openSetting()
      break
  }
}

const openSetting = () => {
  settingStore.setSetting({
    key: 'showDrawer',
    value: true
  })
}
</script>
<style lang="scss" scoped>
.app-tabs {
  @apply border-t border-br;
  :deep(.el-tabs) {
    height: 40px;

    .el-tabs {
      &__header {
        margin-bottom: 0;
      }

      &__content {
        display: none;
      }

      &__nav-next,
      &__nav-prev {
        @apply text-xl;
      }

      &__nav-wrap::after {
        height: 0;
      }

      &__item {
        font-weight: normal;
        padding: 0 15px !important;
        box-sizing: border-box;

        &.is-active {
          background-color: var(--el-color-primary-light-9);

          &::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: var(--el-color-primary);
            margin-right: 6px;
            border-radius: 50%;
            vertical-align: 2px;
          }

          &::after {
            position: absolute;
            content: '';
            display: block;
            top: 0;
            height: 2px;
            left: 0;
            width: 100%;
            background-color: var(--el-color-primary);
          }
        }

        .is-icon-close {
          color: var(--el-text-color-regular);
          vertical-align: -2px;

          &:hover {
            color: var(--color-white);
            background-color: var(--el-color-danger);
          }
        }
      }

      &__active-bar {
        display: none;
      }
    }
  }
}
</style>
