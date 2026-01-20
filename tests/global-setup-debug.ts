import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('Starting global setup...')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Navigate to login page
  console.log('Navigating to login page...')
  await page.goto('http://localhost:5173/admin/login')

  // Wait for the page to be fully loaded
  console.log('Waiting for page to load...')
  await page.waitForLoadState('networkidle')

  // Wait for the form elements to be visible
  console.log('Waiting for form elements...')
  await page.locator('input[placeholder="请输入用户名"]').waitFor()
  await page.locator('input[placeholder="请输入密码"]').waitFor()
  await page.locator('input[placeholder="请输入验证码"]').waitFor()

  // Fill in the username
  console.log('Filling username...')
  await page.locator('input[placeholder="请输入用户名"]').fill('admin')

  // Fill in the password
  console.log('Filling password...')
  await page.locator('input[placeholder="请输入密码"]').fill('123456')

  // Fill in the captcha
  console.log('Filling captcha...')
  await page.locator('input[placeholder="请输入验证码"]').fill('0000')

  // Click the login button
  console.log('Clicking login button...')
  await page.locator('button:has-text("登录")').click()

  // Wait for navigation to dashboard or admin page
  console.log('Waiting for navigation after login...')
  await page.waitForURL(/.*dashboard|.*admin|.*index|.*welcome/, { timeout: 15000 })

  // Store the authentication state
  console.log('Storing authentication state...')
  await page.context().storageState({ path: 'tests/auth.json' })
  console.log('Authentication state stored.')

  await browser.close()
  console.log('Browser closed.')
}

export default globalSetup
