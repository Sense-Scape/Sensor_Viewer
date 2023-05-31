import { expect, test } from '@playwright/test';

test('navbar routes when clicked', async ({ page }) => {
	await page.goto('/');
	await expect(await page.getByRole("navigation").count()).toBe(1);
    await page.getByText("About").click();
    await expect(page.url()).toBe("http://localhost:4173/about");

    await page.getByText("Home").click();
    await expect(page.url()).toBe("http://localhost:4173/");

    await page.goBack();
    await expect(page.url()).toBe("http://localhost:4173/about");

    await page.goForward();
    await expect(page.url()).toBe("http://localhost:4173/");
});
