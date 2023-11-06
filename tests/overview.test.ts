import { expect, test } from '@playwright/test';

test('overview page title is correct', async ({ page }) => {
	await page.goto('/');
	await expect(await page.title()).toBe('Sense-Scape | Overview');
});

test('overview renders navbar and links', async ({ page }) => {
	await page.goto('/');
	await expect(await page.getByRole('navigation').count()).toBe(1);
	await expect(await page.getByRole('navigation').getByRole('link').count()).toBe(2);
});
