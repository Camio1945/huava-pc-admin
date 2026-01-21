import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Navigate to login page
  await page.goto('/admin/login')

  // Fill in the login form
  await page.locator('input[placeholder="请输入用户名"]').fill('admin')
  await page.locator('input[placeholder="请输入密码"]').fill('123456')
  await page.locator('input[placeholder="请输入验证码"]').fill('0000')

  // Click the login button
  await page.locator('button:has-text("登录")').click()

  // Wait for navigation to complete after login
  await page.waitForURL('**/admin/**')

  // Save the storage state to a file
  await page.context().storageState({ path: 'playwright/.auth/admin.json' })

  await browser.close()
}

export default globalSetup
