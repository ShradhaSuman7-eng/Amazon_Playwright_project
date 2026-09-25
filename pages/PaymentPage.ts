import { Page, Locator } from "@playwright/test";

export class PaymentPage {
  readonly page: Page;
  readonly paymentOptions: Locator;

  constructor(page: Page) {
    this.page = page;

    this.paymentOptions = page.locator('input[type="radio"]');
  }

  async selectPaymentMethod() {
    const count = await this.paymentOptions.count();

    if (count > 0) {
      await this.paymentOptions.first().check();
    }
  }
}
