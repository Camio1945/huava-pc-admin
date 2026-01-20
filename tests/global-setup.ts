import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Navigate to login page
  await page.goto('http://localhost:5173/admin/login')

  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle')

  // Wait for the form elements to be visible
  await page.locator('input[placeholder="请输入用户名"]').waitFor()
  await page.locator('input[placeholder="请输入密码"]').waitFor()
  await page.locator('input[placeholder="请输入验证码"]').waitFor()

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

  // Store the authentication state
  await page.context().storageState({ path: 'tests/auth.json' })

  await browser.close()
}

export default globalSetup
