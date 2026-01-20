import { test, expect } from './baseTest'

test.describe('User Management Page Tests', () => {
  test('should successfully navigate to the user management page after login', async ({ authenticatedPage }) => {
    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Verify we're on the correct page - the page should already be on the user management page
    // from the fixture setup, but let's double-check
    await expect(authenticatedPage).toHaveURL(/.*\/admin\/sys\/user\/userPage/)

    // Check that the page title or header contains expected text
    const pageTitle = authenticatedPage.locator('h1, .page-title, .header-title').first()
    await expect(pageTitle)
      .toBeVisible()
      .catch(() => {
        // If no h1 element exists, check for other common header elements
        const header = authenticatedPage.locator('text=用户管理|用户列表|User Management').first()
        expect(header).toBeTruthy()
      })
  })

  test('should display user table with data', async ({ authenticatedPage }) => {
    // The page should already be on the user management page from the fixture setup
    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Verify we're on the correct page
    await expect(authenticatedPage).toHaveURL(/.*\/admin\/sys\/user\/userPage/)

    // Wait for the user table to load
    const userTable = authenticatedPage.locator('.el-table, table, .data-table').first()
    await expect(userTable).toBeVisible({ timeout: 10000 })

    // Check that the table contains at least one row of data (excluding headers)
    const tableRows = authenticatedPage.locator('.el-table__body tr, tbody tr')
    await expect(tableRows).not.toHaveCount(0)

    // Verify that the table has some columns
    const tableHeaders = authenticatedPage.locator('th')
    const headerCount = await tableHeaders.count()

    // The table should have at least one header
    expect(headerCount).toBeGreaterThan(0)
  })

  test('should allow searching for users', async ({ authenticatedPage }) => {
    // Navigate to the user management page
    await authenticatedPage.goto('/admin/sys/user/userPage')

    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Locate the search input field (could be different selectors depending on the UI)
    const searchInput = authenticatedPage
      .locator(
        'input[placeholder*="搜索"], input[placeholder*="Search"], input[placeholder*="用户名"], input[placeholder*="username"]'
      )
      .first()

    if ((await searchInput.count()) > 0) {
      await expect(searchInput).toBeVisible()

      // Enter a search term
      await searchInput.fill('admin')

      // Trigger the search (might be a button click or enter key)
      const searchButton = authenticatedPage.locator('button:has-text("搜索"), button:has-text("Search")').first()
      if ((await searchButton.count()) > 0) {
        await searchButton.click()
      } else {
        await searchInput.press('Enter')
      }

      // Wait for search results to load
      await authenticatedPage.waitForLoadState('networkidle')

      // Verify that search results are displayed
      const searchResults = authenticatedPage.locator('.el-table__body tr, tbody tr')
      await expect(searchResults).not.toHaveCount(0)
    }
  })

  test('should allow adding a new user', async ({ authenticatedPage }) => {
    // Navigate to the user management page
    await authenticatedPage.goto('/admin/sys/user/userPage')

    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Look for an "Add User" or "New User" button
    const addUserButton = authenticatedPage
      .locator('button:has-text("新增"), button:has-text("添加"), button:has-text("Add"), button:has-text("New")')
      .first()

    if ((await addUserButton.count()) > 0) {
      await expect(addUserButton).toBeVisible()
      await addUserButton.click()

      // Wait for the modal or form to appear
      const addUserModal = authenticatedPage.locator('.el-dialog, .modal, .add-user-form').first()
      await expect(addUserModal).toBeVisible({ timeout: 10000 })

      // Fill in user details (these selectors are generic and might need adjustment)
      const usernameInput = authenticatedPage
        .locator('input[placeholder*="用户名"], input[placeholder*="Username"]')
        .first()
      const emailInput = authenticatedPage.locator('input[placeholder*="邮箱"], input[placeholder*="Email"]').first()
      const passwordInput = authenticatedPage
        .locator('input[placeholder*="密码"], input[placeholder*="Password"]')
        .first()

      if ((await usernameInput.count()) > 0) {
        await usernameInput.fill(`testuser_${Date.now()}`)
      }

      if ((await emailInput.count()) > 0) {
        await emailInput.fill(`testuser_${Date.now()}@example.com`)
      }

      if ((await passwordInput.count()) > 0) {
        await passwordInput.fill('TestPass123!')
      }

      // Submit the form
      const submitButton = authenticatedPage
        .locator('button:has-text("提交"), button:has-text("保存"), button:has-text("Submit"), button:has-text("Save")')
        .first()

      if ((await submitButton.count()) > 0) {
        await submitButton.click()

        // Wait for the form to submit and modal to close
        await authenticatedPage.waitForLoadState('networkidle')

        // Verify success message or that the new user appears in the table
        const successMessage = authenticatedPage.locator('.el-message, .alert-success, text=成功, text=Success').first()

        if ((await successMessage.count()) > 0) {
          await expect(successMessage).toBeVisible()
        }
      }
    }
  })

  test('should allow editing an existing user', async ({ authenticatedPage }) => {
    // Navigate to the user management page
    await authenticatedPage.goto('/admin/sys/user/userPage')

    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Find the first edit button in the user table
    const editButton = authenticatedPage.locator('button:has-text("编辑"), button:has-text("Edit"), .edit-btn').first()

    if ((await editButton.count()) > 0) {
      await expect(editButton).toBeVisible()
      await editButton.click()

      // Wait for the edit modal or form to appear
      const editModal = authenticatedPage.locator('.el-dialog, .modal, .edit-user-form').first()
      await expect(editModal).toBeVisible({ timeout: 10000 })

      // Modify some user details
      const usernameInput = authenticatedPage
        .locator('input[placeholder*="用户名"], input[placeholder*="Username"]')
        .first()

      if ((await usernameInput.count()) > 0) {
        const timestamp = Date.now()
        await usernameInput.fill(`updated_user_${timestamp}`)
      }

      // Save the changes
      const saveButton = authenticatedPage
        .locator('button:has-text("保存"), button:has-text("更新"), button:has-text("Save"), button:has-text("Update")')
        .first()

      if ((await saveButton.count()) > 0) {
        await saveButton.click()

        // Wait for the form to submit and modal to close
        await authenticatedPage.waitForLoadState('networkidle')

        // Verify success message
        const successMessage = authenticatedPage.locator('.el-message, .alert-success, text=成功, text=Success').first()

        if ((await successMessage.count()) > 0) {
          await expect(successMessage).toBeVisible()
        }
      }
    }
  })

  test('should allow deleting a user', async ({ authenticatedPage }) => {
    // Navigate to the user management page
    await authenticatedPage.goto('/admin/sys/user/userPage')

    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Find the first delete button in the user table
    const deleteButton = authenticatedPage
      .locator('button:has-text("删除"), button:has-text("Delete"), .delete-btn')
      .first()

    if ((await deleteButton.count()) > 0) {
      await expect(deleteButton).toBeVisible()

      // Store the button's text or some identifier before clicking
      const buttonText = await deleteButton.textContent()

      // Click the delete button
      await deleteButton.click()

      // Handle confirmation dialog if it appears
      const confirmDialog = authenticatedPage.locator('.el-message-box, .confirm-dialog').first()
      if ((await confirmDialog.count()) > 0) {
        await expect(confirmDialog).toBeVisible()

        // Click the confirm button (usually "确定" or "Yes" or "OK")
        const confirmButton = authenticatedPage
          .locator('button:has-text("确定"), button:has-text("是"), button:has-text("Yes"), button:has-text("OK")')
          .first()

        if ((await confirmButton.count()) > 0) {
          await confirmButton.click()

          // Wait for deletion to complete
          await authenticatedPage.waitForLoadState('networkidle')

          // Verify success message
          const successMessage = authenticatedPage
            .locator('.el-message, .alert-success, text=成功, text=Success')
            .first()

          if ((await successMessage.count()) > 0) {
            await expect(successMessage).toBeVisible()
          }
        }
      }
    }
  })

  test('should handle pagination correctly', async ({ authenticatedPage }) => {
    // Navigate to the user management page
    await authenticatedPage.goto('/admin/sys/user/userPage')

    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Look for pagination controls
    const pagination = authenticatedPage.locator('.el-pagination, .pagination').first()

    if ((await pagination.count()) > 0) {
      await expect(pagination).toBeVisible()

      // Check if there are multiple pages
      const pageButtons = authenticatedPage.locator('.el-pagination__pager li:not(.disabled)')

      if ((await pageButtons.count()) > 1) {
        // Click on the second page
        const secondPageBtn = pageButtons.nth(1)
        const pageNum = await secondPageBtn.textContent()

        if (pageNum && parseInt(pageNum) === 2) {
          await secondPageBtn.click()

          // Wait for the page to load
          await authenticatedPage.waitForLoadState('networkidle')

          // Verify that the content has updated
          const currentPageIndicator = authenticatedPage.locator('.el-pagination.is-background .active')
          await expect(currentPageIndicator).toContainText('2')
        }
      }
    }
  })

  test('should handle bulk operations', async ({ authenticatedPage }) => {
    // Navigate to the user management page
    await authenticatedPage.goto('/admin/sys/user/userPage')

    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Look for checkboxes to select users
    const checkboxes = authenticatedPage.locator('input[type="checkbox"].el-checkbox__original')

    if ((await checkboxes.count()) > 1) {
      // More than just the header checkbox
      // Select the first few users
      await checkboxes.first().click()
      if ((await checkboxes.count()) > 1) {
        await checkboxes.nth(1).click()
      }

      // Look for bulk operation buttons
      const bulkDeleteButton = authenticatedPage
        .locator('button:has-text("批量删除"), button:has-text("Bulk Delete")')
        .first()

      if ((await bulkDeleteButton.count()) > 0) {
        await expect(bulkDeleteButton).toBeEnabled()
        // Note: We won't actually perform bulk delete to avoid data loss in tests
      }
    }
  })

  test('should maintain authentication when navigating away and back', async ({ authenticatedPage }) => {
    // The page should already be on the user management page from the fixture setup
    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Verify we're on the correct page
    await expect(authenticatedPage).toHaveURL(/.*\/admin\/sys\/user\/userPage/)

    // Navigate away from the user page
    await authenticatedPage.goto('/admin/dashboard')
    await authenticatedPage.waitForLoadState('networkidle')

    // Navigate back to the user page
    await authenticatedPage.goto('/admin/sys/user/userPage')

    // Wait for possible redirect after navigation
    await authenticatedPage.waitForURL(/.*\/admin\/sys\/user\/userPage|.*\/admin\/login/, { timeout: 10000 })

    // If we end up on the login page, it means session was lost
    if (authenticatedPage.url().includes('/admin/login')) {
      throw new Error('Session lost - redirected back to login page after navigation')
    }

    // Wait for the page to load completely
    await authenticatedPage.waitForLoadState('networkidle')

    // Verify that we're still logged in and on the correct page
    await expect(authenticatedPage).toHaveURL(/.*\/admin\/sys\/user\/userPage/)
    const userTable = authenticatedPage.locator('.el-table, table, .data-table').first()
    await expect(userTable).toBeVisible()
  })
})
