import { test, expect } from '@playwright/test';
import path from 'path';


test('Should successfully login using valid credentials', async ({ page }) => {
  await page.goto('https://aerovault.aero-strategies.com/');
  await page.locator('#login-email-input').fill('avap');
  await page.locator('#login-password-input').fill('123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Successfully Logged In!')).toBeVisible();
  await page.getByText('General OverviewRegister New').click();
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  await page.screenshot({path: 'test-screenshot/loginspec/login-success.png', fullPage: true})
});


test('Should unsuccessfully login using invalid credentials', async ({ page }) => {
  await page.goto('https://aerovault.aero-strategies.com/');
  await page.locator('#login-email-input').click();
  await page.locator('#login-email-input').fill('avaps');
  await page.locator('#login-password-input').click();
  await page.locator('#login-password-input').fill('123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Unauthorized')).toBeVisible();
  await page.screenshot({path: 'test-screenshot/loginspec/login-failed.png', fullPage: true})
  await expect(page.getByRole('main')).toContainText('Log in to Account name or email PasswordForgot Password?Login');
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - main:
      - heading "Log in to" [level=6]
      - img "AeroVault Logo"
      - heading "Account name or email" [level=6]
      - textbox: avaps
      - heading "Password" [level=6]
      - textbox: /\\d+/
      - button
      - paragraph: Forgot Password?
      - button "Login"
    `);
});

test('should mask and unmask password', async ({ page }) => {
  await page.goto('https://aerovault.aero-strategies.com/');
  await page.locator('#login-password-input').fill('123');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.screenshot({path: 'test-screenshot/loginspec/unmask.png', fullPage: true})
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Unauthorized').click();
});
