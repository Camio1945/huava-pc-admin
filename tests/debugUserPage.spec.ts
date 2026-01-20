import { test, expect } from '@playwright/test'

test.describe('Debug User Page Navigation Test', () => {
  test('debug login and navigation', async ({ page }) => {
    // Navigate to login page
    await page.goto('/admin/login')

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')

    console.log('Current URL after navigating to login:', page.url())

    // Wait for the form elements to be visible
    await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible()
    await expect(page.locator('input[placeholder="请输入密码"]')).toBeVisible()
    await expect(page.locator('input[placeholder="请输入验证码"]')).toBeVisible()

    // Fill in the username
    await page.locator('input[placeholder="请输入用户名"]').fill('admin')

    // Fill in the password
    await page.locator('input[placeholder="请输入密码"]').fill('123456')

    // Fill in the captcha
    await page.locator('input[placeholder="请输入验证码"]').fill('0000')

    // Click the login button
    await page.locator('button:has-text("登录")').click()

    // Wait for navigation to dashboard or admin page
    await page.waitForURL(/.*dashboard|.*admin|.*index|.*welcome/, { timeout: 15000 })

    console.log('Current URL after login:', page.url())

    // Check if we're on a dashboard/welcome page
    const isLoggedIn =
      page.url().includes('dashboard') ||
      page.url().includes('admin') ||
      page.url().includes('index') ||
      page.url().includes('welcome')
    console.log('Is logged in?', isLoggedIn)

    // Navigate to the user page
    await page.goto('/admin/sys/user/userPage')

    console.log('Current URL after navigating to user page:', page.url())

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')

    // Check if we're still logged in
    const isStillLoggedIn = !page.url().includes('/admin/login')
    console.log('Is still logged in?', isStillLoggedIn)

    if (!isStillLoggedIn) {
      console.log('Redirected back to login. Checking for error messages...')
      const errorMessage = page.locator('.error, .message, .el-message, [role="alert"]')
      if ((await errorMessage.count()) > 0) {
        console.log('Found error message:', await errorMessage.textContent())
      }
    }
  })
})
