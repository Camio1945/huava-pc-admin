import { Page } from '@playwright/test';

export class AuthHelper {
  constructor(private page: Page) {}

  async login(username: string = 'admin', password: string = '123456') {
    await this.page.goto('/admin/login');
    
    // Fill in the login form
    await this.page.locator('input[placeholder="请输入用户名"]').fill(username);
    await this.page.locator('input[placeholder="请输入密码"]').fill(password);
    // Using a default captcha code since we're testing
    await this.page.locator('input[placeholder="请输入验证码"]').fill('0000');
    
    // Click the login button
    await this.page.locator('button:has-text("登录")').click();
    
    // Wait for navigation to dashboard or home page
    await this.page.waitForURL('**/admin/**');
  }

  async logout() {
    // Find and click the logout button (implementation depends on the UI)
    // This might vary depending on the actual UI implementation
    await this.page.locator('button:text("退出登录")').click();
    await this.page.waitForURL('**/login**');
  }

  async isAuthenticated(): Promise<boolean> {
    // Check if we're not on the login page anymore
    const currentUrl = this.page.url();
    return !currentUrl.includes('/login');
  }
}