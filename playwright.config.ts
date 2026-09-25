import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  timeout: 60 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  fullyParallel: false,

  retries: 0,

  reporter: "html",

  use: {
    baseURL: "https://www.amazon.in",

    headless: false,

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    trace: "on-first-retry",

    viewport: {
      width: 1280,
      height: 720,
    },
  },

  projects: [
    {
      // Authentication setup
      name: "setup",

      testMatch: /auth\.setup\.ts/,

      // IMPORTANT:
      // Setup must NOT try to load user.json.
      use: {
        storageState: undefined,
      },
    },

    {
      // Actual Amazon E2E tests
      name: "chromium",

      use: {
        ...devices["Desktop Chrome"],

        // Use the authenticated session created by setup
        storageState: "playwright/.auth/user.json",
      },

      // Run setup before this project
      dependencies: ["setup"],
    },
  ],
});
