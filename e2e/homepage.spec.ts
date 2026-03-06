import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the hero section with HY title", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("HY");
  });

  test("should display subtitle with name and role", async ({ page }) => {
    const subtitle = page.locator("text=山本浩裕 | AI × Full-Stack Engineer");
    await expect(subtitle).toBeVisible();
  });

  test("should render the 3D canvas", async ({ page }) => {
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
  });

  test("should display scroll indicator", async ({ page }) => {
    const scrollIndicator = page.locator(".animate-bounce").first();
    await expect(scrollIndicator).toBeVisible();
  });

  test("should display projects preview section", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const projectsHeading = page.locator("text=開発実績");
    await expect(projectsHeading).toBeVisible();
  });

  test("should display 'すべてのプロジェクトを見る' link", async ({ page }) => {
    const link = page.locator("text=すべてのプロジェクトを見る");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/projects");
  });

  test("should show at most 3 project cards in preview", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const cards = page.locator('a[href^="/projects/"]');
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(3);
    expect(count).toBeGreaterThan(0);
  });
});
