<template>
  <el-container class="dashboard-container">
    <div class="user-info">
      <el-avatar :icon="User" :size="60" class="user-avatar" />
      <div class="user-greeting">
        <el-text size="large" tag="b"
          >Hello, <span class="username">{{ username }}</span
          >!
        </el-text>
        <el-text type="info">Welcome back to your dashboard</el-text>
      </div>
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Monitor, User, Document, ChatLineRound, Setting } from '@element-plus/icons-vue'

const username = ref('')

onMounted(() => {
  // Get username from wherever it's stored in your app (localStorage, store, etc.)
  // This is a placeholder - adjust based on your authentication implementation
  const user = localStorage.getItem('username') || 'User'
  username.value = user
})
</script>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 80px);
}

.welcome-card {
  margin: 20px;
  border-radius: 8px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome-title {
  font-size: 2rem;
  margin: 0;
  color: #1f2937;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
}

.user-avatar {
  background-color: #409eff;
}

.user-greeting {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.username {
  color: #409eff;
  font-weight: bold;
}

.stats-section {
  margin-top: 30px;
}

.stat-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 24px;
  color: #409eff;
}

.stat-content {
  text-align: left;
}

.el-text {
  display: block;
}
</style>
