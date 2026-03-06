import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("should display page title and subtitle", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("About");
    await expect(page.locator("text=自己紹介")).toBeVisible();
  });

  test("should display bio section with name", async ({ page }) => {
    await expect(page.locator("text=山本浩裕").first()).toBeVisible();
  });

  test("should display AI engineer tagline", async ({ page }) => {
    const tagline = page.locator("text=AIを製品として組み込めるフルスタックエンジニア");
    await expect(tagline.first()).toBeVisible();
  });

  test("should display all 8 certifications", async ({ page }) => {
    const certifications = [
      "応用情報技術者",
      "AWS SAP",
      "LPIC Level 3",
      "Java Gold",
      "CCNA",
      "Salesforce Platform Admin",
      "Salesforce Agentforce Specialist",
      "TOEIC 915",
    ];

    for (const cert of certifications) {
      await expect(page.locator(`text=${cert}`).first()).toBeVisible();
    }
  });

  test("should display skill categories", async ({ page }) => {
    const categories = [
      "言語",
      "フレームワーク",
      "AI/LLM",
      "DB",
    ];

    for (const category of categories) {
      await expect(page.locator(`text=${category}`).first()).toBeVisible();
    }
  });

  test("should display skill bars with names", async ({ page }) => {
    const skills = ["Python", "TypeScript", "React", "PostgreSQL", "Git"];

    for (const skill of skills) {
      await expect(page.locator(`text=${skill}`).first()).toBeVisible();
    }
  });

  test("should display skill duration labels", async ({ page }) => {
    // Git should show as "2年8ヶ月" (32 months)
    const gitDuration = page.locator("text=2年8ヶ月");
    await expect(gitDuration.first()).toBeVisible();
  });

  test("should have correct page metadata", async ({ page }) => {
    const title = await page.title();
    expect(title).toContain("About");
    expect(title).toContain("Hiromichi Yamamoto");
  });
});
