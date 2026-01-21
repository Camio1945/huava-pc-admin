import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/login');
  }

  async login(username: string, password: string, captchaCode: string = '0000') {
    await this.page.locator('input[placeholder="请输入用户名"]').fill(username);
    await this.page.locator('input[placeholder="请输入密码"]').fill(password);
    await this.page.locator('input[placeholder="请输入验证码"]').fill(captchaCode);
    await this.page.locator('button:has-text("登录")').click();
  }

  async isLoggedIn(): Promise<boolean> {
    // Check if we're redirected away from the login page
    const currentUrl = this.page.url();
    return !currentUrl.includes('/login');
  }

  async isOnLoginPage(): Promise<boolean> {
    const currentUrl = this.page.url();
    return currentUrl.includes('/login');
  }

  async getUsernameInput() {
    return this.page.locator('input[placeholder="请输入用户名"]');
  }

  async getPasswordInput() {
    return this.page.locator('input[placeholder="请输入密码"]');
  }

  async getCaptchaInput() {
    return this.page.locator('input[placeholder="请输入验证码"]');
  }

  async getLoginButton() {
    return this.page.locator('button:has-text("登录")');
  }
}