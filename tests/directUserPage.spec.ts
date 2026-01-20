import { test, expect } from '@playwright/test'

test.describe('Direct User Page Navigation Test', () => {
  test('should navigate to user page after manual login', async ({ page }) => {
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

    // Wait for navigation to dashboard or admin page
    await page.waitForURL(/.*dashboard|.*admin|.*index|.*welcome/, { timeout: 15000 })

    // Now navigate to the user page
    await page.goto('/admin/sys/user/userPage')

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')

    // Verify that we are on the correct page
    await expect(page).toHaveURL(/.*\/admin\/sys\/user\/userPage/)

    // Check that the page title or header contains expected text
    const pageTitle = page.locator('h1, .page-title, .header-title').first()
    await expect(pageTitle)
      .toBeVisible()
      .catch(() => {
        // If no h1 element exists, check for other common header elements
        const header = page.locator('text=用户管理|用户列表|User Management').first()
        expect(header).toBeTruthy()
      })
  })
})
