import { test, expect } from '@playwright/test';

test('login: valid credentials', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.locator('a[routerLink="/login"]').click();
  await page.locator('#usr').fill('player1');
  await page.locator('#pwd').fill('passwordSegreta123');
  await page.locator('form button[type="submit"]').click();
  
  await expect(page.getByText('Accesso Eseguito')).toBeVisible();
  await expect(page).toHaveURL('http://localhost:4200/home');
});

test('login: invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:4200/login');
  await page.locator('#usr').fill('player1');
  await page.locator('#pwd').fill('passwordSbagliata');
  await page.locator('form button[type="submit"]').click();

  const errorBox = page.locator('.alert-box.error-box');
  await expect(errorBox).toBeVisible(); 
  await expect(errorBox).not.toBeEmpty();
  await expect(page).toHaveURL('http://localhost:4200/login');
});

test('login: bypass validation', async ({ page }) => {
  await page.goto('http://localhost:4200/home');
  await expect(page.getByLabel('Accesso Negato!')).toBeVisible();
  await expect(page).toHaveURL('http://localhost:4200/login');
});

test('signup', async ({ page }) => {
  const usernameUnico = `user_${Date.now()}`;

  await page.goto('http://localhost:4200');
  await page.locator('a[routerLink="/signup"]').click();
  await page.locator('#usr').fill(usernameUnico);
  await page.locator('#pwd').fill('password123');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByText('Benvenuto')).toBeVisible();
  await expect(page).toHaveURL('http://localhost:4200/login');

  await page.locator('#usr').fill(usernameUnico);
  await page.locator('#pwd').fill('password123');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByText('Accesso Eseguito')).toBeVisible();
  await expect(page).toHaveURL('http://localhost:4200/home');
});