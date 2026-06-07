import { test, expect } from '@playwright/test';

test.describe('Test che Richiede Login', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/login');
        await page.locator('#usr').fill('player1');
        await page.locator('#pwd').fill('passwordSegreta123');
        await page.locator('form button[type="submit"]').click();
        await expect(page).toHaveURL('http://localhost:4200/home');
    });

    test('logout', async ({ page }) => {
        await page.locator('button.logout-btn').click();
        await expect(page.getByRole('navigation')).toContainText('Accedi');
        await expect(page.getByRole('navigation')).toContainText('Registrati');
        await expect(page).toHaveURL('http://localhost:4200/leaderboard');
    });

    test('game: bypass validation', async ({ page }) => {
        await page.goto('http://localhost:4200/play/9999');
        await expect(page.getByLabel('Errore')).toBeVisible();
        await expect(page).not.toHaveURL(/.*play.*/);
    });

    test('game: inizia partita', async ({ page }) => {
        await page.locator('button.btn-start').click();
        await expect(page).toHaveURL(/.*play.*/);
        await expect(page.getByText('Tentativi: 0')).toBeVisible();
        await expect(page.getByText('Nessuna parola indovinata ancora')).toBeVisible();

        page.on('dialog', dialog => dialog.accept());
        await page.locator('button.btn-surrender').click();
        await expect(page.getByText('Partita Conclusa')).toBeVisible();
        await page.locator('button[routerLink="/home"]').click();
        await expect(page).toHaveURL('http://localhost:4200/home');
    });

    test('game: riprendi partita', async ({ page }) => {
        await page.locator('button.btn-start').click();
        await expect(page).toHaveURL(/.*play.*/);
        
        await page.locator('a[routerLink="/leaderboard"]').click();
        await expect(page).toHaveURL('http://localhost:4200/leaderboard');
        await page.locator('a[routerLink="/home"]').click();
        await expect(page).toHaveURL('http://localhost:4200/home');
        await expect(page.getByText('Hai una partita in sospeso!')).toBeVisible();
        await page.locator('button.btn-resume').click();
        await expect(page).toHaveURL(/.*play.*/);

        page.on('dialog', dialog => dialog.accept());
        await page.locator('button.btn-surrender').click();
        await expect(page.getByText('Partita Conclusa')).toBeVisible();
        await page.locator('button[routerLink="/home"]').click();
        await expect(page).toHaveURL('http://localhost:4200/home');
    });
});