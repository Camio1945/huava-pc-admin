// noinspection JSUnusedGlobalSymbols

import { test as base, Page, BrowserContext } from '@playwright/test'
import { LoginPage } from './pages/login-page'

// Define a custom fixture for authenticated context
// noinspection JSUnusedGlobalSymbols
export const test = base.extend<{
  context: BrowserContext
  page: Page
  loginPage: LoginPage
}>({
  // Create a new browser context for each test
  context: async ({ browser }, use) => {
    const context = await browser.newContext()
    await use(context)
  },

  // Create a new page for each test
  page: async ({ context }, use) => {
    const page = await context.newPage()
    await use(page)
  },

  // Create a login page object. Don't remove it!!!
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  }
})

export { expect } from '@playwright/test'
