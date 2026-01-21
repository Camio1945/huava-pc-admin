import { test as base, Page } from '@playwright/test'

// Create a test that handles authentication internally
export const test = base.extend<{
  authenticatedPage: Page
}>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    // Perform login
    await page.goto('/admin/login')

    // Fill in the login form
    await page.locator('input[placeholder="请输入用户名"]').fill('admin')
    await page.locator('input[placeholder="请输入密码"]').fill('123456')
    await page.locator('input[placeholder="请输入验证码"]').fill('0000')

    // Click the login button
    await page.locator('button:has-text("登录")').click()

    // Wait for navigation to complete after login
    await page.waitForURL('**/admin/**')

    // Wait a bit more to ensure all async operations complete
    await page.waitForTimeout(1000)

    await use(page)

    // Cleanup
    await context.close()
  }
})

export { expect } from '@playwright/test'
