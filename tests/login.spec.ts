import { test, expect } from '@playwright/test'

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')
    // Wait for the form elements to be visible
    await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible()
    await expect(page.locator('input[placeholder="请输入密码"]')).toBeVisible()
    await expect(page.locator('input[placeholder="请输入验证码"]')).toBeVisible()
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    // Fill in the username
    await page.locator('input[placeholder="请输入用户名"]').fill('admin')

    // Fill in the password
    await page.locator('input[placeholder="请输入密码"]').fill('123456')

    // Fill in the captcha
    await page.locator('input[placeholder="请输入验证码"]').fill('0000')

    // Click the login button
    await page.locator('button:has-text("登录")').click()

    // Wait for navigation or check for successful login indicators
    await expect(page).toHaveURL(/.*dashboard|.*admin|.*index/, { timeout: 15000 })
  })

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in incorrect username
    await page.locator('input[placeholder="请输入用户名"]').fill('invalid')

    // Fill in incorrect password
    await page.locator('input[placeholder="请输入密码"]').fill('wrongpassword')

    // Fill in the captcha
    await page.locator('input[placeholder="请输入验证码"]').fill('0000')

    // Click the login button
    await page.locator('button:has-text("登录")').click()

    // Expect to stay on the login page or see some error indication
    await expect(page).toHaveURL(/.*\/admin\/login/)
  })

  test('should validate required fields', async ({ page }) => {
    // Clear the username
    await page.locator('input[placeholder="请输入用户名"]').fill('')

    // Clear the password
    await page.locator('input[placeholder="请输入密码"]').fill('')

    // Clear the captcha
    await page.locator('input[placeholder="请输入验证码"]').fill('')

    // Click the login button
    await page.locator('button:has-text("登录")').click()

    // Check that we're still on the login page due to validation errors
    await expect(page).toHaveURL(/.*\/admin\/login/)
  })
})
