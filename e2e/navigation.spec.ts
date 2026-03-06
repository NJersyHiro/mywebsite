import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should display header with navigation links", async ({ page }) => {
    await page.goto("/");

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const logo = page.locator("header a[href='/']").first();
    await expect(logo).toContainText("HY");
  });

  test("should have correct navigation links", async ({ page }) => {
    await page.goto("/");

    const navLinks = page.locator("header nav ul li a");
    await expect(navLinks.nth(0)).toHaveAttribute("href", "/");
    await expect(navLinks.nth(1)).toHaveAttribute("href", "/projects");
    await expect(navLinks.nth(2)).toHaveAttribute("href", "/personal-projects");
    await expect(navLinks.nth(3)).toHaveAttribute("href", "/about");
  });

  test("should navigate to Projects page", async ({ page }) => {
    await page.goto("/");

    await page.locator("header nav ul li a[href='/projects']").click();
    await page.waitForURL("/projects");

    await expect(page.locator("h1")).toContainText("Projects");
  });

  test("should navigate to About page", async ({ page }) => {
    await page.goto("/");

    await page.locator("header nav ul li a[href='/about']").click();
    await page.waitForURL("/about");

    await expect(page.locator("h1")).toContainText("About");
  });

  test("should navigate back to Home from Projects", async ({ page }) => {
    await page.goto("/projects");

    await page.locator("header a[href='/']").first().click();
    await page.waitForURL("/");

    await expect(page.locator("h1")).toContainText("HY");
  });

  test("should display footer with copyright", async ({ page }) => {
    await page.goto("/about");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("HY - 山本浩裕");
    await expect(footer).toContainText("2026");
  });

  test("should have GitHub link in footer", async ({ page }) => {
    await page.goto("/about");

    const githubLink = page.locator("footer a[href='https://github.com/']");
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toContainText("GitHub");
  });
});
