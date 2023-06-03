import { expect, test } from '@playwright/test';

test('about shows simple about heading', async ({ page }) => {
	await page.goto('/about');
	await expect(page.getByRole('heading', { name: 'About Sense-Scape' })).toBeVisible();
});

test('about page title is correct', async ({ page }) => {
	await page.goto('/about');
	await expect(await page.title()).toBe('Sense-Scape | About');
});

test('about renders navbar and links', async ({ page }) => {
	await page.goto('/about');
	await expect(await page.getByRole('navigation').count()).toBe(1);
	await expect(await page.getByRole('navigation').getByRole('link').count()).toBe(2);
});
