import { test, expect } from '@playwright/test';

test('has title and skip link', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Ian Edmundson/);

  // Expect skip link to be present
  const skipLink = page.getByRole('link', { name: /skip to main content/i });
  await expect(skipLink).toBeAttached();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // Click the About link.
  await page.getByRole('link', { name: 'About' }).click();

  // Expects page to have a heading with the name of About.
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
});

test('theme toggle works', async ({ page }) => {
  await page.goto('/');

  const themeToggle = page.getByRole('button', { name: /toggle theme/i });

  const initialTheme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );

  await themeToggle.click();

  const newTheme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );

  expect(newTheme).not.toBe(initialTheme);
  expect(['light', 'dark']).toContain(newTheme);
});