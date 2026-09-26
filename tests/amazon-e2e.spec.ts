import { test, expect } from "@playwright/test";

import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { CartPage } from "../pages/CartPage";
import { AddressPage } from "../pages/AddressPage";
import { PaymentPage } from "../pages/PaymentPage";
import { CheckoutPage } from "../pages/CheckoutPage";

import { testData } from "../utils/testData";

test.describe("Amazon End-to-End Purchase Flow", () => {
  test("Search product → Add to cart → Checkout", async ({ page }) => {
    // 1. Create Home Page
    const homePage = new HomePage(page);

    // 2. Create Search Results Page
    const searchResultsPage = new SearchResultsPage(page);

    // 3. Open Amazon
    await homePage.goto();

    console.log("Amazon opened successfully");

    // 4. Search Product
    await homePage.searchProduct(testData.invalidProduct);

    await page.waitForTimeout(6000);

    console.log(`Searching for: ${testData.invalidProduct}`);

    await homePage.searchProduct(testData.validProduct);

    await page.waitForTimeout(6000);

    // 5. Verify Search Results
    await searchResultsPage.waitForResults();

    const productCount = await searchResultsPage.getProductCount();

    console.log("Product count:", productCount);

    expect(productCount).toBeGreaterThan(0);

    // 6. Get First Product
    const productName = await searchResultsPage.getFirstProductTitle();

    console.log("Selected product:", productName);

    expect(productName).not.toBe("");

    // 7. Open Product
    const productPage = await searchResultsPage.clickFirstProduct();

    console.log("Product page URL:", productPage.url());

    // 8. Create Product Details Page
    const productDetailsPage = new ProductDetailsPage(productPage);

    // 9. Verify Product Page
    await productDetailsPage.waitForProduct();

    const detailProductName = await productDetailsPage.getProductTitle();

    console.log("Product details:", detailProductName);

    expect(detailProductName).not.toBe("");

    // 10. Add Product To Cart
    await productDetailsPage.addToCart();

    // Give Amazon time to process the request
    await productPage.waitForTimeout(3000);

    // 11. Create Cart Page
    const cartPage = new CartPage(productPage);

    // 12. Open Cart
    await cartPage.openCart();

    console.log("Cart opened");

    // 13. Verify Product Is Actually In Cart
    await cartPage.verifyProductInCart(productName);

    // Increment quantity

    await cartPage.incrementQuantity();

    await page.waitForTimeout(6000);

    await cartPage.incrementQuantity();

    await page.waitForTimeout(6000);

    await cartPage.incrementQuantity();

    await page.waitForTimeout(6000);

    await cartPage.decrementQuantity();

    console.log("Product verified in cart");

    // 14. Proceed To Buy
    await cartPage.proceedToCheckout();

    console.log("Proceeding to checkout");

    // 15. Create Address Page
    const addressPage = new AddressPage(productPage);

    // 16. Select Address
    await addressPage.selectAddress();

    await addressPage.continueWithAddress();

    console.log("Address selected");

    // 17. Create Payment Page
    const paymentPage = new PaymentPage(productPage);

    // 18. Select Payment Method
    await paymentPage.selectPaymentMethod();

    console.log("Payment method selected");

    // 19. Create Checkout Page
    const checkoutPage = new CheckoutPage(productPage);

    // 20. Final Order Review
    await checkoutPage.verifyPlaceOrderButton();

    console.log("Final order review page reached");

    // 21. Verify Place Order Button
    await expect(checkoutPage.placeOrderButton).toBeVisible();

    console.log("E2E checkout flow completed");

    console.log("Place Order button verified.");
  });
});
