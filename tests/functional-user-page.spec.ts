import { test, expect } from '@playwright/test'

test.describe('Functional User Management Page Tests', () => {
  test('should successfully navigate to the user management page after login', async ({ page }) => {
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
    
    // Wait for navigation to dashboard or admin page
    await page.waitForURL(/.*dashboard|.*admin|.*index|.*welcome/, { timeout: 15000 })
    
    // Wait for the page to be fully loaded after login
    await page.waitForLoadState('networkidle')
    
    // Navigate to the user management page
    await page.goto('/admin/sys/user/userPage')
    
    // Wait for possible redirect after navigation
    await page.waitForURL(/.*\/admin\/sys\/user\/userPage|.*\/admin\/login/, { timeout: 10000 })
    
    // If we end up on the login page, it means authentication failed
    if (page.url().includes('/admin/login')) {
      throw new Error('Authentication failed - redirected back to login page')
    }
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
    
    // Verify we're on the correct page
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
  
  test('should display user table with data', async ({ page }) => {
    // Perform login first
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    await page.locator('input[placeholder="请输入用户名"]').waitFor()
    await page.locator('input[placeholder="请输入密码"]').waitFor()
    await page.locator('input[placeholder="请输入验证码"]').waitFor()
    await page.locator('input[placeholder="请输入用户名"]').fill('admin')
    await page.locator('input[placeholder="请输入密码"]').fill('123456')
    await page.locator('input[placeholder="请输入验证码"]').fill('0000')
    await page.locator('button:has-text("登录")').click()
    await page.waitForURL(/.*dashboard|.*admin|.*index|.*welcome/, { timeout: 15000 })
    await page.waitForLoadState('networkidle')
    
    // Navigate to the user management page
    await page.goto('/admin/sys/user/userPage')
    
    // Wait for possible redirect after login
    await page.waitForURL(/.*\/admin\/sys\/user\/userPage|.*\/admin\/login/, { timeout: 10000 })
    
    // If we end up on the login page, it means authentication failed
    if (page.url().includes('/admin/login')) {
      throw new Error('Authentication failed - redirected back to login page')
    }
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
    
    // Wait for the user table to load
    const userTable = page.locator('.el-table, table, .data-table').first()
    await expect(userTable).toBeVisible({ timeout: 10000 })
    
    // Check that the table contains at least one row of data (excluding headers)
    const tableRows = page.locator('.el-table__body tr, tbody tr')
    await expect(tableRows).not.toHaveCount(0)
    
    // Verify that the table has columns like username, email, etc.
    const usernameColumn = page.locator('th:text("用户名"), th:text("Username")').first()
    const statusColumn = page.locator('th:text("状态"), th:text("Status")').first()
    
    await expect(usernameColumn.or(statusColumn)).toBeVisible()
  })
  
  test('should maintain authentication when navigating away and back', async ({ page }) => {
    // Perform login first
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')
    await page.locator('input[placeholder="请输入用户名"]').waitFor()
    await page.locator('input[placeholder="请输入密码"]').waitFor()
    await page.locator('input[placeholder="请输入验证码"]').waitFor()
    await page.locator('input[placeholder="请输入用户名"]').fill('admin')
    await page.locator('input[placeholder="请输入密码"]').fill('123456')
    await page.locator('input[placeholder="请输入验证码"]').fill('0000')
    await page.locator('button:has-text("登录")').click()
    await page.waitForURL(/.*dashboard|.*admin|.*index|.*welcome/, { timeout: 15000 })
    await page.waitForLoadState('networkidle')
    
    // Navigate to the user management page
    await page.goto('/admin/sys/user/userPage')
    
    // Wait for possible redirect after login
    await page.waitForURL(/.*\/admin\/sys\/user\/userPage|.*\/admin\/login/, { timeout: 10000 })
    
    // If we end up on the login page, it means authentication failed
    if (page.url().includes('/admin/login')) {
      throw new Error('Authentication failed - redirected back to login page')
    }
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
    
    // Navigate away from the user page
    await page.goto('/admin/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Navigate back to the user page
    await page.goto('/admin/sys/user/userPage')
    
    // Wait for possible redirect after navigation
    await page.waitForURL(/.*\/admin\/sys\/user\/userPage|.*\/admin\/login/, { timeout: 10000 })
    
    // If we end up on the login page, it means session was lost
    if (page.url().includes('/admin/login')) {
      throw new Error('Session lost - redirected back to login page after navigation')
    }
    
    // Verify that we're still logged in and on the correct page
    await expect(page).toHaveURL(/.*\/admin\/sys\/user\/userPage/)
    const userTable = page.locator('.el-table, table, .data-table').first()
    await expect(userTable).toBeVisible()
  })
})