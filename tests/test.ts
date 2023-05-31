import { expect, test } from '@playwright/test';

test('card with rate is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('rate', {exact: true})).toBeVisible();
});

test('card with samples is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('samples')).toBeVisible();
});

test('card with resolution is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('resolution')).toBeVisible();
});

test('card with time is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('time')).toBeVisible();
});

test('card with freq is visible', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('freq')).toBeVisible();
});

test('playing stream updates the sample rate', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Rate: null')).toBeVisible();
	await page.getByRole("button", {name: "Start Stream"}).click();
	await expect(page.getByText('Rate: null')).toBeHidden();
	await expect(page.getByText('Rate: 44100')).toBeVisible();
	await expect(page.getByText('freq')).toBeVisible();
});

test('about shows simple about heading', async ({ page }) => {
	await page.goto('/about');
	await expect(page.getByRole('heading', { name: "About SvelteKit" })).toBeVisible();
});