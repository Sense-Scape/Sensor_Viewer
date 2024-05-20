import { expect, test } from '@playwright/test';

test('navbar routes when clicked', async ({ page, baseURL }) => {
	await page.goto('/');
	await expect(await page.getByRole('navigation').count()).toBe(1);

	await Promise.all([page.waitForEvent('framenavigated'), page.getByText('Map').click()]);

	await expect(page.url()).toBe(baseURL + '/map');

	await Promise.all([page.waitForEvent('framenavigated'), page.getByText('Home').click()]);

	await expect(page.url()).toBe(baseURL + '/');

	await Promise.all([page.waitForEvent('framenavigated'), page.goBack()]);

	await expect(page.url()).toBe(baseURL + '/map');

	await Promise.all([page.waitForEvent('framenavigated'), page.goForward()]);

	await expect(page.url()).toBe(baseURL + '/');
});
