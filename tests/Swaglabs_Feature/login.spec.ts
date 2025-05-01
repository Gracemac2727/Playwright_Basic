import { test, expect } from '@playwright/test';
test.describe('Sauce Demo Login Testcases', () => {

    test('should log in successfully with valid credentials', async ({ page }) => {
      await page.goto('https://www.saucedemo.com/');
      await expect(page.getByText('Swag Labs')).toBeVisible();
  
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');

      const loginButton = page.locator('[data-test="login-button"]');
      await expect(loginButton).toBeVisible();
      await loginButton.click();
  
      await expect(page.locator('[data-test="title"]')).toHaveText('Products');
      await page.screenshot({path: 'test-screenshot/sauce_loginspec/saucelogin.png', fullPage: true})

    });

 test('should display error with invalid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // log in using invalid credentials
    await page.locator('[data-test="username"]').fill('standards_user'); // typo in username
    await page.locator('[data-test="password"]').fill('secretsauce'); // typo in password
    await page.locator('[data-test="login-button"]').click();
  
    // error message visible
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
});
test('Retry login after failed attempt with corrected credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  
    // log in using invalid credentials
    await page.locator('[data-test="username"]').fill('standards_user'); // typo in username
    await page.locator('[data-test="password"]').fill('secretsauce'); // typo in password
    await page.locator('[data-test="login-button"]').click();
  
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  
    // Close error message
    const closeErrorButton = page.locator('[data-test="error-button"]');
    await expect(closeErrorButton).toBeVisible();
    await closeErrorButton.click();
  
    // Input Correct credentials
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  
    // successful login by checking the products header landing page
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('should log out successfully after login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});