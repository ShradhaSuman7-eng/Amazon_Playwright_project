import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.placeOrderButton = page.getByRole("button", {
      name: /place your order|place order/i,
    });
  }

  async verifyPlaceOrderButton() {
    await this.placeOrderButton.waitFor({
      state: "visible",
    });
  }
}
