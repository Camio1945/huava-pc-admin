import { test, expect } from './authenticated-test'

test.describe('User Page', () => {
  test('should navigate to user page after login', async ({ authenticatedPage: page }) => {
    // Navigate to user page
    await page.goto('/admin/sys/user/userPage')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Verify we're on the user page by checking URL
    await expect(page).toHaveURL(/.*\/admin\/sys\/user\/userPage$/)

    // Look for elements that indicate we're on the user page
    // Use more flexible selectors
    await expect(page.locator('text=用户').first()).toBeVisible() // More general text
  })

  test('should display user table', async ({ authenticatedPage: page }) => {
    // Navigate to user page
    await page.goto('/admin/sys/user/userPage')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Wait for the table to load - use more generic selector
    await page.waitForSelector('table, .el-table, [data-v-*], .table').catch(() => {})

    // Check if any table-like element is present
    const tableSelectors = [
      page.locator('table').first(),
      page.locator('.el-table').first(),
      page.locator('[role="table"]').first(),
      page.locator('.table').first()
    ]

    let tableFound = false
    for (const selector of tableSelectors) {
      if ((await selector.count()) > 0) {
        await expect(selector).toBeVisible()
        tableFound = true
        break
      }
    }

    // At least one table-like element should be found
    expect(tableFound).toBeTruthy()
  })

  test('should have add user button', async ({ authenticatedPage: page }) => {
    // Navigate to user page
    await page.goto('/admin/sys/user/userPage')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for the add user button - use more flexible selectors
    const addButtonSelectors = [
      page.locator('button:has-text("新增")').first(),
      page.locator('button:has-text("添加")').first(),
      page.locator('button:has-text("Add")').first(),
      page.locator('.el-button:has-text("新增")').first(),
      page.locator('[data-testid="add-user-btn"]').first()
    ]

    let buttonFound = false
    for (const selector of addButtonSelectors) {
      if ((await selector.count()) > 0) {
        await expect(selector).toBeVisible()
        await expect(selector).toBeEnabled()
        buttonFound = true
        break
      }
    }

    // At least one add button should be found
    expect(buttonFound).toBeTruthy()
  })

  test('should have search functionality', async ({ authenticatedPage: page }) => {
    // Navigate to user page
    await page.goto('/admin/sys/user/userPage')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for search inputs - use more flexible selectors
    const searchSelectors = [
      page.locator('input[placeholder*="搜索"]').first(),
      page.locator('input[placeholder*="Search"]').first(),
      page.locator('input[placeholder*="用户"]').first(),
      page.locator('.el-input__inner[placeholder*="搜索"]').first(),
      page.locator('[role="search"] input').first()
    ]

    let searchFound = false
    for (const selector of searchSelectors) {
      if ((await selector.count()) > 0) {
        await expect(selector).toBeVisible()
        searchFound = true
        break
      }
    }

    // At least one search input should be found
    expect(searchFound).toBeTruthy()
  })
})
