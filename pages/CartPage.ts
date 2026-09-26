import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartButton: Locator;
  readonly proceedToBuyButton: Locator;
  readonly incrementButton: Locator;
  readonly decrementButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartButton = page.locator("#nav-cart");

    this.proceedToBuyButton = page.locator(
      'input[name="proceedToRetailCheckout"]',
    );

    this.incrementButton = page.locator('button[data-a-selector="increment"]');
    this.decrementButton = page.locator('button[data-a-selector="decrement"]');
  }

  async openCart() {
    console.log("Opening Amazon cart...");

    await this.page.goto("/gp/cart/view.html");

    await this.page.waitForLoadState("domcontentloaded");

    console.log("Cart URL:", this.page.url());
  }

  async verifyProductInCart(productName: string) {
    console.log("Checking whether product exists in cart...");

    const product = this.page.getByText(productName, {
      exact: false,
    });

    const count = await product.count();

    console.log("Matching product count in cart:", count);

    if (count === 0) {
      throw new Error(`Product was not found in cart: ${productName}`);
    }

    console.log("Product successfully verified in cart.");
  }

  async incrementQuantity() {
    console.log("Incrementing product quantity...");

    const count = await this.incrementButton.count();

    console.log("Increment buttons found:", count);

    if (count === 0) {
      throw new Error("Increment button was not found in the cart.");
    }

    await this.incrementButton.first().scrollIntoViewIfNeeded();

    await this.incrementButton.first().click();

    console.log("Product quantity incremented.");
  }

  async decrementQuantity() {
    console.log("Decrementing product quantity");

    const count = await this.decrementButton.count();

    console.log("Decrement button ", count);

    if (count === 0) {
      throw new Error("Decrement button was not found in the cart.");
    }

    await this.decrementButton.first().scrollIntoViewIfNeeded();

    if (count > 0) {
      await this.decrementButton.first().click();
    }

    console.log("Product Quantity decremented");
  }

  async proceedToCheckout() {
    const count = await this.proceedToBuyButton.count();

    console.log("Proceed to Buy count:", count);

    if (count === 0) {
      throw new Error("Proceed to Buy button was not found on the cart page.");
    }

    await this.proceedToBuyButton.first().scrollIntoViewIfNeeded();

    await this.proceedToBuyButton.first().click();

    console.log("Proceed to Buy clicked.");

    await this.page.waitForLoadState("domcontentloaded");

    console.log("Checkout URL:", this.page.url());
  }
}
