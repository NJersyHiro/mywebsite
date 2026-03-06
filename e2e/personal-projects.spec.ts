import { test, expect } from "@playwright/test";

test.describe("Personal Projects Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/personal-projects");
  });

  test("should display page title and subtitle", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Personal Projects");
    await expect(page.locator("text=個人開発実績")).toBeVisible();
  });

  test("should display 10 personal project cards", async ({ page }) => {
    const cards = page.locator('a[href^="/personal-projects/"]');
    await expect(cards).toHaveCount(10);
  });

  test("should display YTScript project card", async ({ page }) => {
    const card = page.locator("text=YTScript").first();
    await expect(card).toBeVisible();
  });

  test("should display 議事録AI project card", async ({ page }) => {
    const card = page.locator("text=議事録AI").first();
    await expect(card).toBeVisible();
  });

  test("should display GitHub badges on cards", async ({ page }) => {
    const badges = page.locator("text=GitHub");
    const count = await badges.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test("should display tech tags on project cards", async ({ page }) => {
    const tags = page.locator(
      '[class*="rounded-full"][class*="text-neon-blue"]'
    );
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should navigate to project detail on card click", async ({ page }) => {
    const firstCard = page.locator('a[href^="/personal-projects/"]').first();
    await firstCard.click();

    await page.waitForURL(/\/personal-projects\/.+/);
    await expect(page.locator("text=← Personal Projects")).toBeVisible();
  });
});

test.describe("Personal Project Detail Page", () => {
  test("should display YTScript project detail", async ({ page }) => {
    await page.goto("/personal-projects/ytscript");

    await expect(page.locator("h1")).toContainText("YTScript");
    await expect(page.locator("text=← Personal Projects")).toBeVisible();
    await expect(page.locator("text=ソースコードを見る")).toBeVisible();
  });

  test("should display GitHub link", async ({ page }) => {
    await page.goto("/personal-projects/ytscript");

    const githubLink = page.locator(
      'a[href="https://github.com/NJersyHiro/ytscript"]'
    );
    await expect(githubLink).toBeVisible();
  });

  test("should display tech tags", async ({ page }) => {
    await page.goto("/personal-projects/ytscript");

    const tags = page.locator('[class*="rounded-full"]');
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should display project content", async ({ page }) => {
    await page.goto("/personal-projects/ytscript");

    const article = page.locator("article");
    await expect(article).toBeVisible();
    const textContent = await article.textContent();
    expect(textContent?.length).toBeGreaterThan(50);
  });

  test("should navigate back to personal projects list", async ({ page }) => {
    await page.goto("/personal-projects/ytscript");

    await page.locator("text=← Personal Projects").click();
    await page.waitForURL("/personal-projects");

    await expect(page.locator("h1")).toContainText("Personal Projects");
  });

  test("should return 404 for non-existent project", async ({ page }) => {
    const response = await page.goto(
      "/personal-projects/non-existent-project"
    );
    expect(response?.status()).toBe(404);
  });

  test("should display all 10 personal project detail pages", async ({
    page,
  }) => {
    const slugs = [
      "ytscript",
      "gijiroku",
      "reddit-jp",
      "lifeagent",
      "therapy-ai",
      "ai-career-discovery",
      "aidouga",
      "gemini-video-shorts",
      "paper-to-podcast",
      "nikkei-ai",
    ];

    for (const slug of slugs) {
      const response = await page.goto(`/personal-projects/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("article")).toBeVisible();
    }
  });
});
