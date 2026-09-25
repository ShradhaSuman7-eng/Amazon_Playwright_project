import { Page, Locator } from "@playwright/test";

export class AddressPage {
  readonly page: Page;
  readonly addressRadio: Locator;
  readonly useThisAddressButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addressRadio = page.locator('input[type="radio"]').first();

    this.useThisAddressButton = page.getByRole("button", {
      name: /use this address/i,
    });
  }

  async selectAddress() {
    if (await this.addressRadio.isVisible()) {
      await this.addressRadio.check();
    }
  }

  async continueWithAddress() {
    if (await this.useThisAddressButton.isVisible()) {
      await this.useThisAddressButton.click();
    }
  }
}
