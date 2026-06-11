import { test, expect, Page } from '@playwright/test';

async function avviaPartita(page: Page) {
    await page.locator('button.btn-start').click();
    await expect(page).toHaveURL(/.*play.*/);
}

async function arrenditiETornaHome(page: Page) {
    page.once('dialog', dialog => dialog.accept());
    await page.locator('button.btn-surrender').click();
    await expect(page.getByText('Partita Conclusa')).toBeVisible();
    await page.locator('button[routerLink="/home"]').click();
    await expect(page).toHaveURL('http://localhost:4200/home');
}

test.describe.serial('Test che richiedono Login', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/login');
        await page.locator('#usr').fill('player1');
        await page.locator('#pwd').fill('passwordSegreta123');
        await page.locator('form button[type="submit"]').click();
        await expect(page).toHaveURL('http://localhost:4200/home');
    });

    test('game: inizia partita', async ({ page }) => {
        await avviaPartita(page);
        await expect(page.getByText('Tentativi: 0')).toBeVisible();
        await expect(page.getByText('Nessuna parola indovinata ancora')).toBeVisible();
        await arrenditiETornaHome(page);
    });

    test('game: riprendi partita', async ({ page }) => {
        await avviaPartita(page);
        
        await page.goto('http://localhost:4200/home');
        await expect(page.getByText('Hai una partita in sospeso!')).toBeVisible();
        await page.locator('button.btn-resume').click();
        await expect(page).toHaveURL(/.*play.*/);

        await arrenditiETornaHome(page);
    });

    test('game: indovina una parola', async ({ page }) => {
        await avviaPartita(page);

        await page.locator('input[formControlName="word"]').fill('il');
        await page.locator('form button[type="submit"]').click();
        await expect(page.getByText('Tentativi: 1')).toBeVisible();
        await expect(page.getByText('Parole indovinate finora: 1')).toBeVisible();

        await page.locator('input[formControlName="word"]').fill('e');
        await page.locator('form button[type="submit"]').click();
        await expect(page.getByText('Tentativi: 2')).toBeVisible();
        await expect(page.getByText('Parole indovinate finora: 2')).toBeVisible();

        await arrenditiETornaHome(page);
    });
});