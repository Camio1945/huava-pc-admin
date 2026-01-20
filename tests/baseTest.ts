import { test as base, expect } from '@playwright/test'

// Define the types for our custom fixtures
type AuthFixtures = {
  authenticatedPage: any
}

// Create a new test object with our custom fixture
export const test = base.extend<AuthFixtures>({
  // Create an authenticated context as a fixture
  authenticatedPage: async ({ browser }, use) => {
    // Create a new context
    const context = await browser.newContext()

    // Create a new page in the context
    const page = await context.newPage()

    // Navigate to login page
    await page.goto('/admin/login')

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

    // Wait for navigation - after login, the page should go to dashboard or user page
    await page.waitForURL(/.*dashboard|.*admin|.*index|.*welcome|.*userPage/, { timeout: 15000 })

    // Wait for the page to be fully loaded after login
    await page.waitForLoadState('networkidle')

    // Verify that we're on an authenticated page (dashboard, admin, or user page)
    expect(page.url()).toMatch(/.*dashboard|.*admin|.*index|.*welcome|.*userPage/)

    // Pass the authenticated page to the test
    await use(page)

    // Clean up: close the context after the test
    await context.close()
  }
})

export { expect }
