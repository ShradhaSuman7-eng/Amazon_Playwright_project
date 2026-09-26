import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartButton: Locator;
  readonly proceedToBuyButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartButton = page.locator("#nav-cart");

    this.proceedToBuyButton = page.locator(
      'input[name="proceedToRetailCheckout"]',
    );
  }

  private getProductRow(productName: string): Locator {
    return this.page.locator("div.sc-list-item").filter({
      has: this.page.getByText(productName, {
        exact: false,
      }),
    });
  }

  async openCart() {
    console.log("Opening Amazon cart...");

    await this.page.goto("/gp/cart/view.html");

    await this.page.waitForLoadState("domcontentloaded");

    console.log("Cart URL:", this.page.url());
  }

  async verifyProductInCart(productName: string) {
    console.log(`Checking product in cart: ${productName}`);

    const product = this.getProductRow(productName);

    await expect(product.first()).toBeVisible();

    console.log(`Product successfully verified: ${productName}`);
  }

  async incrementQuantity(productName: string) {
    console.log(`Incrementing quantity for: ${productName}`);

    const product = this.getProductRow(productName);

    await expect(product.first()).toBeVisible();

    const incrementButton = product
      .first()
      .locator('button[data-a-selector="increment"]');

    await expect(incrementButton).toBeVisible();

    await incrementButton.scrollIntoViewIfNeeded();

    await incrementButton.click();

    console.log(`Quantity incremented for: ${productName}`);
  }

  async decrementQuantity(productName: string) {
    console.log(`Decrementing quantity for: ${productName}`);

    const product = this.getProductRow(productName);

    await expect(product.first()).toBeVisible();

    const decrementButton = product
      .first()
      .locator('button[data-a-selector="decrement"]');

    await expect(decrementButton).toBeVisible();

    await decrementButton.scrollIntoViewIfNeeded();

    await decrementButton.click();

    console.log(`Quantity decremented for: ${productName}`);
  }

  async removeProductFromCart(productName: string) {
    console.log(`Removing product from cart: ${productName}`);

    const product = this.getProductRow(productName);

    await expect(product.first()).toBeVisible();

    const deleteButton = product
      .first()
      .locator('input[data-feature-id="item-delete-button"]');

    await expect(deleteButton).toBeVisible();

    await deleteButton.scrollIntoViewIfNeeded();

    await deleteButton.click();

    console.log(`Delete clicked for: ${productName}`);

    await expect(product.first()).toHaveCount(0);

    console.log(`Product successfully removed: ${productName}`);
  }

  async proceedToCheckout() {
    console.log("Proceeding to checkout...");

    await expect(this.proceedToBuyButton.first()).toBeVisible();

    await this.proceedToBuyButton.first().scrollIntoViewIfNeeded();

    await this.proceedToBuyButton.first().click();

    console.log("Proceed to Buy clicked.");

    await this.page.waitForLoadState("domcontentloaded");

    console.log("Checkout URL:", this.page.url());
  }
}
