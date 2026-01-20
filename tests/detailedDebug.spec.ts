import { test, expect } from '@playwright/test'

test.describe('Detailed Debug Login Test', () => {
  test('detailed login flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('/admin/login')
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    console.log('1. Current URL after navigating to login:', page.url())
    
    // Wait for the form elements to be visible
    await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible()
    await expect(page.locator('input[placeholder="请输入密码"]')).toBeVisible()
    await expect(page.locator('input[placeholder="请输入验证码"]')).toBeVisible()
    
    // Fill in the username
    await page.locator('input[placeholder="请输入用户名"]').fill('admin')
    
    console.log('2. Username filled')
    
    // Fill in the password
    await page.locator('input[placeholder="请输入密码"]').fill('123456')
    
    console.log('3. Password filled')
    
    // Fill in the captcha
    await page.locator('input[placeholder="请输入验证码"]').fill('0000')
    
    console.log('4. Captcha filled')
    
    // Click the login button
    console.log('5. About to click login button')
    await page.locator('button:has-text("登录")').click()
    
    console.log('6. Clicked login button, waiting for navigation...')
    
    // Wait for navigation to dashboard or admin page
    try {
      await page.waitForURL(/.*dashboard|.*admin|.*index|.*welcome/, { timeout: 10000 })
      console.log('7. Successfully navigated after login. New URL:', page.url())
    } catch (error) {
      console.log('7. Did not navigate after login. Current URL:', page.url())
      
      // Wait a bit more to see if there are any changes
      await page.waitForTimeout(2000)
      console.log('8. After waiting 2 seconds. URL:', page.url())
      
      // Check for any error messages on the login page
      const errorMessages = page.locator('.error, .message, .el-message, [role="alert"], .el-message-box')
      if (await errorMessages.count() > 0) {
        console.log('Found possible error elements:')
        for (let i = 0; i < await errorMessages.count(); i++) {
          const text = await errorMessages.nth(i).textContent()
          console.log(`  Error ${i + 1}:`, text?.trim())
        }
      }
    }
    
    // Check the page content after login attempt
    const pageContent = await page.content()
    if (pageContent.includes('登录') && pageContent.includes('用户名')) {
      console.log('Still on login page - login may have failed')
    } else {
      console.log('Not on login page - login may have succeeded')
    }
    
    // Now try to navigate to the user page
    console.log('9. Attempting to navigate to user page...')
    await page.goto('/admin/sys/user/userPage')
    
    console.log('10. After navigating to user page. URL:', page.url())
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle')
    
    console.log('11. After network idle. URL:', page.url())
    
    // Check if we're still on the user page or got redirected
    if (page.url().includes('/admin/login')) {
      console.log('Redirected back to login page')
    } else if (page.url().includes('/admin/sys/user/userPage')) {
      console.log('Successfully on user page')
    } else {
      console.log('On some other page')
    }
  })
})