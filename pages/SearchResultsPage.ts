import { Page, Locator } from "@playwright/test";

export class SearchResultsPage {
  readonly page: Page;
  readonly searchResults: Locator;
  readonly productTitles: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchResults = page.locator(
      '[data-component-type="s-search-result"]',
    );

    this.productTitles = this.searchResults.locator("h2");
  }

  async waitForResults() {
    await this.searchResults.first().waitFor({
      state: "visible",
    });
  }

  async getProductCount(): Promise<number> {
    return await this.searchResults.count();
  }

  async getFirstProductTitle(): Promise<string> {
    return await this.productTitles.first().innerText();
  }

  async clickFirstProduct(): Promise<Page> {
    const context = this.page.context();

    const pagesBefore = context.pages().length;

    await this.productTitles.first().scrollIntoViewIfNeeded();

    await this.productTitles.first().click();

    await this.page.waitForTimeout(2000);

    const pagesAfter = context.pages();

    // New tab/page opened
    if (pagesAfter.length > pagesBefore) {
      const newPage = pagesAfter[pagesAfter.length - 1];

      await newPage.waitForLoadState("domcontentloaded");

      return newPage;
    }

    // Same tab navigation
    await this.page.waitForLoadState("domcontentloaded");

    return this.page;
  }
}
