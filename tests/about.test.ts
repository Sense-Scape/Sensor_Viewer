import { expect, test } from '@playwright/test';

test('about shows simple about heading', async ({ page }) => {
	await page.goto('/about');
	await expect(page.getByRole('heading', { name: "About SvelteKit" })).toBeVisible();
});

test('about page title is correct', async ({ page }) => {
	await page.goto('/about');
	await expect(await page.title()).toBe("Sense-Scape | About");
});
