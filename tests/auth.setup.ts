import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("https://www.amazon.in/ap/signin");

  console.log("Amazon login page opened.");
  console.log("Please login manually in the browser.");

  await page.pause();

  await page.context().storageState({
    path: authFile,
  });

  console.log("Authentication state saved to:", authFile);
});
