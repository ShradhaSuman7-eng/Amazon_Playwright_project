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
  test("Add Mouse + Laptop → Cart → Remove Mouse → Checkout", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    // =========================================================
    // Open Amazon
    // =========================================================

    await homePage.goto();

    console.log("Amazon opened successfully");

    // =========================================================
    // Search Mouse
    // =========================================================

    await homePage.searchProduct(testData.validProduct.first);

    console.log(`Searching for: ${testData.validProduct.first}`);

    await searchResultsPage.waitForResults();

    const mouseName = await searchResultsPage.getFirstProductTitle();

    console.log("Mouse selected:", mouseName);

    expect(mouseName).not.toBe("");

    // =========================================================
    // Open Mouse Product
    // =========================================================

    const mousePage = await searchResultsPage.clickFirstProduct();

    console.log("Mouse product page:", mousePage.url());

    const mouseDetailsPage = new ProductDetailsPage(mousePage);

    await mouseDetailsPage.waitForProduct();

    const mouseDetailName = await mouseDetailsPage.getProductTitle();

    console.log("Mouse details:", mouseDetailName);

    expect(mouseDetailName).not.toBe("");

    // =========================================================
    // Add Mouse To Cart
    // =========================================================

    await mouseDetailsPage.addToCart();

    console.log("Mouse added to cart");

    // =========================================================
    // Return To Home
    // =========================================================

    await page.goto("/");

    await page.waitForLoadState("domcontentloaded");

    console.log("Returned to Amazon home page");

    // =========================================================
    // Search Laptop
    // =========================================================

    await homePage.searchProduct(testData.validProduct.second);

    console.log(`Searching for: ${testData.validProduct.second}`);

    await searchResultsPage.waitForResults();

    const laptopName = await searchResultsPage.getFirstProductTitle();

    console.log("Laptop selected:", laptopName);

    expect(laptopName).not.toBe("");

    // =========================================================
    // Open Laptop Product
    // =========================================================

    const laptopPage = await searchResultsPage.clickFirstProduct();

    console.log("Laptop product page:", laptopPage.url());

    const laptopDetailsPage = new ProductDetailsPage(laptopPage);

    await laptopDetailsPage.waitForProduct();

    const laptopDetailName = await laptopDetailsPage.getProductTitle();

    console.log("Laptop details:", laptopDetailName);

    expect(laptopDetailName).not.toBe("");

    // =========================================================
    // Add Laptop To Cart
    // =========================================================

    await laptopDetailsPage.addToCart();

    console.log("Laptop added to cart");

    // =========================================================
    // Open Cart
    // =========================================================

    const cartPage = new CartPage(laptopPage);

    await cartPage.openCart();

    console.log("Cart opened");

    // =========================================================
    // Verify Mouse
    // =========================================================

    await cartPage.verifyProductInCart(mouseName);

    console.log("Mouse verified in cart");

    // =========================================================
    // Verify Laptop
    // =========================================================

    await cartPage.verifyProductInCart(laptopName);

    console.log("Laptop verified in cart");

    // =========================================================
    // Increment Laptop Quantity
    // =========================================================

    await cartPage.incrementQuantity(laptopName);

    console.log("Laptop quantity incremented");

    // =========================================================
    // Increment Laptop Again
    // =========================================================

    await cartPage.incrementQuantity(laptopName);

    console.log("Laptop quantity incremented again");

    // =========================================================
    // Decrement Laptop
    // =========================================================

    await cartPage.decrementQuantity(laptopName);

    console.log("Laptop quantity decremented");

    // =========================================================
    // Remove Mouse
    // =========================================================

    await cartPage.removeProductFromCart(mouseName);

    console.log("Mouse removed from cart");

    // =========================================================
    // Verify Laptop Still Exists
    // =========================================================

    await cartPage.verifyProductInCart(laptopName);

    console.log("Laptop is still present in cart");

    // =========================================================
    // Proceed To Checkout
    // =========================================================

    await cartPage.proceedToCheckout();

    console.log("Proceeding to checkout");

    console.log("Current checkout URL:", laptopPage.url());

    // =========================================================
    // Address
    // =========================================================

    const addressPage = new AddressPage(laptopPage);

    await addressPage.selectAddress();

    await addressPage.continueWithAddress();

    console.log("Address selected");

    console.log("URL after address selection:", laptopPage.url());

    // =========================================================
    // Payment
    // =========================================================

    const paymentPage = new PaymentPage(laptopPage);

    await paymentPage.selectPaymentMethod();

    console.log("Payment method selected");

    console.log("URL after payment selection:", laptopPage.url());

    // =========================================================
    // Checkout
    // =========================================================

    const checkoutPage = new CheckoutPage(laptopPage);

    await checkoutPage.verifyPlaceOrderButton();

    console.log("Final order review page reached");

    await expect(checkoutPage.placeOrderButton).toBeVisible();

    console.log("E2E checkout flow completed");

    console.log("Place Order button verified.");
  });
});
