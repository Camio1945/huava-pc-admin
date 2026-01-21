<template>
  <div class="dashboard-container">
    <div class="welcome-section">
      <h1>Welcome to the Dashboard</h1>
      <p>Hello, <span class="username">{{ username }}</span>!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
  padding: 2rem;
  min-height: calc(100vh - 80px); /* Adjust based on your header/footer height */
}

.welcome-section {
  text-align: center;
  margin-top: 2rem;
}

.welcome-section h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.welcome-section p {
  font-size: 1.2rem;
  color: #4b5563;
}

.username {
  font-weight: bold;
  color: #3b82f6;
}
</style>
