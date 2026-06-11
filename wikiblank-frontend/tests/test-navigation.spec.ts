import { test, expect } from '@playwright/test';

test.describe('Test che richiedono Login', () => {

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
});

test('leaderboard', async ({ page }) => {
    await page.goto('http://localhost:4200/leaderboard');
    await expect(page.getByText('Classifica Globale di WikiBlank')).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
});

test('archive', async ({ page }) => {
    await page.goto('http://localhost:4200/leaderboard');
    await page.locator('button[routerLink="/archive"]').click();
    await expect(page).toHaveURL('http://localhost:4200/archive');
    await expect(page.getByText('Archivio')).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
});

test('archive details', async ({ page }) => {
    await page.goto('http://localhost:4200/archive');
    const primaRiga = page.locator('table tbody tr').first();
    if (await primaRiga.isVisible()) {
        const giocatoreTabella = (await primaRiga.locator('td').nth(0).innerText()).trim();
        const esitoTabella = (await primaRiga.locator('td').nth(1).innerText()).trim();
        const tentativiTabella = (await primaRiga.locator('td').nth(2).innerText()).trim();
        const tempoTabella = (await primaRiga.locator('td').nth(3).innerText()).trim();

        await primaRiga.locator('button.btn-details').click();
        await expect(page.locator('.card-header')).toContainText(giocatoreTabella);

        const boxTentativi = page.locator('.stat-box').filter({ hasText: 'Tentativi' });
        await expect(boxTentativi.locator('.value')).toContainText(tentativiTabella);
        const boxTempo = page.locator('.stat-box').filter({ hasText: 'Tempo' });
        await expect(boxTempo.locator('.value')).toContainText(tempoTabella);

        const boxEsito = page.locator('.stat-box').filter({ hasText: 'Esito' });
        await expect(boxEsito.locator('.badge')).toContainText(esitoTabella, { ignoreCase: true });
    } else {
        console.log('Tabella vuota: nessuna partita presente da verificare.');
    }
});