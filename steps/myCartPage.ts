import { Then } from "@cucumber/cucumber";
import MyCartPage from "../src/pageObjects/myCartPage";
import { expect } from "playwright/test";

Then('the cart displays message that is empty', async function () {
    const myCartPage: MyCartPage = this.poManager.getMyCartPage()
    this.msg = await myCartPage.verifyCart()
    expect(await this.msg).toBe('No Products in Your Cart !')
    console.log('Scenario PASSED')
});


