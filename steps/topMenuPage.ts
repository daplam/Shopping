import { Then, When } from "@cucumber/cucumber";
import TopMenu from "../src/pageObjects/topMenuPage";
import { TOPOPTIONS } from "../src/constants/constants";

When('the user navigates to Cart option', async function () {
    const topMenu: TopMenu = this.poManager.getTopMenu()
    await topMenu.clickTopOption({ option: TOPOPTIONS.CART })

});