import { Page, Locator } from "@playwright/test";

export class ProductDetailsPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Visible product title
    this.productTitle = page.locator(
      "span#productTitle.product-title-word-break",
    );

    // Amazon's actual Add to Cart input
    this.addToCartButton = page.locator(
      'input[value*="Add to Cart" i]:visible',
    );
  }

  async waitForProduct() {
    await this.productTitle.waitFor({
      state: "visible",
      timeout: 15000,
    });
  }

  async getProductTitle(): Promise<string> {
    return await this.productTitle.innerText();
  }

  async addToCart() {
    console.log("Current product URL:", this.page.url());

    const buttons = this.page.locator(
      '#add-to-cart-button[name="submit.add-to-cart"]',
    );

    const count = await buttons.count();

    console.log("Add to Cart count:", count);

    if (count === 0) {
      throw new Error("Add to Cart button not found.");
    }

    let addToCartButton: Locator | null = null;

    for (let i = 0; i < count; i++) {
      const currentButton = buttons.nth(i);

      console.log(`Checking Add to Cart button ${i}`);

      if (await currentButton.isVisible()) {
        addToCartButton = currentButton;
        console.log(`Visible Add to Cart found at index: ${i}`);
        break;
      }
    }

    if (!addToCartButton) {
      throw new Error("No visible Add to Cart button found.");
    }

    console.log("Button enabled:", await addToCartButton.isEnabled());

    console.log("Button value:", await addToCartButton.getAttribute("value"));

    await addToCartButton.scrollIntoViewIfNeeded();

    await addToCartButton.click();

    console.log("Add to Cart button clicked.");

    await this.page.waitForTimeout(3000);

    console.log("URL after Add to Cart:", this.page.url());

    const cartCount = this.page.locator("#nav-cart-count");

    if ((await cartCount.count()) > 0) {
      console.log(
        "Cart count after adding:",
        await cartCount.first().innerText(),
      );
    }

    const bodyText = await this.page.locator("body").innerText();

    console.log(
      "Contains 'Added to Cart':",
      bodyText.toLowerCase().includes("added to cart"),
    );
  }
}
