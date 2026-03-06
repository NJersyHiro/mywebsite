import { test, expect } from "@playwright/test";

test.describe("Projects Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
  });

  test("should display page title and subtitle", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Projects");
    await expect(page.getByText("開発実績", { exact: true })).toBeVisible();
  });

  test("should display work projects section", async ({ page }) => {
    await expect(page.locator("text=業務開発実績")).toBeVisible();
  });

  test("should display personal projects section", async ({ page }) => {
    await expect(page.locator("text=個人開発実績")).toBeVisible();
  });

  test("should display 6 work project cards", async ({ page }) => {
    const cards = page.locator('a[href^="/projects/"]');
    await expect(cards).toHaveCount(6);
  });

  test("should display 10 personal project cards", async ({ page }) => {
    const cards = page.locator('a[href^="/personal-projects/"]');
    await expect(cards).toHaveCount(10);
  });

  test("should display SKOSH project card", async ({ page }) => {
    const skoshCard = page.locator("text=SKOSH").first();
    await expect(skoshCard).toBeVisible();
  });

  test("should display AI動画解析 project card", async ({ page }) => {
    const aiVideoCard = page.locator("text=AI動画解析").first();
    await expect(aiVideoCard).toBeVisible();
  });

  test("should display tech tags on work project cards", async ({ page }) => {
    const tags = page.locator(
      '[class*="rounded-full"][class*="text-neon-purple"]'
    );
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should navigate to work project detail on card click", async ({
    page,
  }) => {
    const firstCard = page.locator('a[href^="/projects/"]').first();
    await firstCard.click();

    await page.waitForURL(/\/projects\/.+/);
    await expect(page.locator("text=← Projects")).toBeVisible();
  });

  test("should navigate to personal project detail on card click", async ({
    page,
  }) => {
    const firstCard = page.locator('a[href^="/personal-projects/"]').first();
    await firstCard.click();

    await page.waitForURL(/\/personal-projects\/.+/);
    await expect(page.locator("text=← Personal Projects")).toBeVisible();
  });
});

test.describe("Project Detail Page", () => {
  test("should display SKOSH project detail", async ({ page }) => {
    await page.goto("/projects/ec-site-skosh");

    await expect(page.locator("h1")).toContainText("SKOSH");
    await expect(page.locator("text=← Projects")).toBeVisible();
  });

  test("should display project period and role", async ({ page }) => {
    await page.goto("/projects/ec-site-skosh");

    const periodRole = page.locator("text=2025");
    await expect(periodRole.first()).toBeVisible();
  });

  test("should display tech tags", async ({ page }) => {
    await page.goto("/projects/ec-site-skosh");

    const tags = page.locator('[class*="rounded-full"]');
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display project content", async ({ page }) => {
    await page.goto("/projects/ec-site-skosh");

    const article = page.locator("article");
    await expect(article).toBeVisible();
    const textContent = await article.textContent();
    expect(textContent?.length).toBeGreaterThan(50);
  });

  test("should navigate back to projects list", async ({ page }) => {
    await page.goto("/projects/ec-site-skosh");

    await page.locator("text=← Projects").click();
    await page.waitForURL("/projects");

    await expect(page.locator("h1")).toContainText("Projects");
  });

  test("should return 404 for non-existent project", async ({ page }) => {
    const response = await page.goto("/projects/non-existent-project");
    expect(response?.status()).toBe(404);
  });

  test("should display all 6 project detail pages", async ({ page }) => {
    const slugs = [
      "ec-site-skosh",
      "ai-video-analysis",
      "ai-agent-support",
      "genai-platform",
      "salesforce-compass",
      "invoice-ai-automation",
    ];

    for (const slug of slugs) {
      const response = await page.goto(`/projects/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("article")).toBeVisible();
    }
  });
});
