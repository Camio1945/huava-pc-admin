import { test, expect } from '@playwright/test'

test.describe('Check Login Result', () => {
  test('check what happens after login', async ({ page }) => {
    // Navigate to login page
    await page.goto('/admin/login')

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')

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

    // Wait a moment to see what happens
    await page.waitForTimeout(3000)

    console.log('URL after login attempt:', page.url())
    console.log('Page content after login attempt:', await page.content())

    // Check for error messages
    const errorSelectors = ['.error', '.message', '.el-message', '[role="alert"]', '.el-message-box']
    for (const selector of errorSelectors) {
      const elements = page.locator(selector)
      if ((await elements.count()) > 0) {
        console.log(`Found elements with selector ${selector}:`)
        for (let i = 0; i < (await elements.count()); i++) {
          const text = await elements.nth(i).textContent()
          console.log(`  Element ${i + 1}:`, text?.trim())
        }
      }
    }

    // Check for success indicators
    const successIndicators = ['首页', 'Dashboard', 'Welcome', '控制台', '首页', '工作台']
    for (const indicator of successIndicators) {
      const elements = page.locator(`text=${indicator}`)
      if ((await elements.count()) > 0) {
        console.log(`Found success indicator "${indicator}":`, await elements.first().textContent())
      }
    }
  })
})
