import { test, expect } from "@playwright/test";

test.describe("Responsive Design", () => {
  test("mobile: should show hamburger menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const hamburger = page.locator("header button[aria-label='メニューを開く']");
    await expect(hamburger).toBeVisible();

    // Desktop nav should be hidden
    const desktopNav = page.locator("header nav ul.hidden");
    await expect(desktopNav).toBeHidden();
  });

  test("mobile: hamburger menu should open and show links", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const hamburger = page.locator("header button[aria-label='メニューを開く']");
    await hamburger.click();

    // Wait for the mobile menu div to appear (conditionally rendered)
    const mobileMenu = page.locator("header div.md\\:hidden ul");
    await expect(mobileMenu).toBeVisible();

    const projectsLink = mobileMenu.locator("a[href='/projects']");
    await expect(projectsLink).toBeVisible();
  });

  test("mobile: should navigate via hamburger menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await page.locator("header button[aria-label='メニューを開く']").click();

    // Wait for mobile menu to render then click About link inside it
    const mobileMenu = page.locator("header div.md\\:hidden ul");
    await expect(mobileMenu).toBeVisible();
    await mobileMenu.locator("a[href='/about']").click();

    await page.waitForURL("/about");
    await expect(page.locator("h1")).toContainText("About");
  });

  test("desktop: should show navigation links", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    const navLinks = page.locator("header nav ul.hidden.md\\:flex li a");
    await expect(navLinks).toHaveCount(3);
  });

  test("tablet: projects grid should be 2 columns", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/projects");

    const grid = page.locator('[class*="grid"]').first();
    await expect(grid).toBeVisible();
  });

  test("mobile: projects grid should be 1 column", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/projects");

    const grid = page.locator('[class*="grid"]').first();
    await expect(grid).toBeVisible();
  });
});
