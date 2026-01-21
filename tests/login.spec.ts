import { test, expect } from './base-test'

test.describe('Login Page', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/admin/login')

    // Verify we're on the login page
    await expect(page).toHaveURL(/.*\/admin\/login$/)
    await expect(page.locator('text=登录')).toBeVisible()
  })

  test('should not login when missing required fields', async ({ page }) => {
    await page.goto('/admin/login')

    // Clear any potential autofill values
    await page.locator('input[placeholder="请输入用户名"]').fill('')
    await page.locator('input[placeholder="请输入密码"]').fill('')
    await page.locator('input[placeholder="请输入验证码"]').fill('')

    // Try to submit the form without filling any fields
    await page.locator('button:has-text("登录")').click()

    // Wait a bit for validation to occur
    await page.waitForTimeout(500)

    // Check if we're still on the login page
    await expect(page).toHaveURL(/.*\/admin\/login$/)

    // The page should still be visible
    await expect(page.locator('text=登录')).toBeVisible()
  })

  test('should not login with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login')

    // Fill in wrong credentials
    await page.locator('input[placeholder="请输入用户名"]').fill('invalid')
    await page.locator('input[placeholder="请输入密码"]').fill('wrongpassword')
    await page.locator('input[placeholder="请输入验证码"]').fill('0000')

    // Click login
    await page.locator('button:has-text("登录")').click()

    // Wait for potential error message
    await page.waitForTimeout(1000)

    // Verify we're still on the login page (login failed)
    await expect(page).toHaveURL(/.*\/admin\/login$/)
  })

  test('should login by valid user', async ({ page, loginPage }) => {
    // Ensure we're on the login page
    await page.goto('/admin/login')

    // Perform login with valid credentials
    await loginPage.login('admin', '123456', '0000')

    // Wait for redirection after login
    await page.waitForURL('**/admin/**')

    // Verify we're no longer on the login page
    await expect(page).not.toHaveURL(/.*\/admin\/login$/)
  })
})
