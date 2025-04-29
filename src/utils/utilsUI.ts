import { Page } from "@playwright/test";
import POManager from "../pageObjects/POManager";
import { TOPOPTIONS } from "../pageObjects/topMenuPage";

class UtilsUI {

    page: Page
    poManager: POManager

    constructor(page) {
        this.page = page
        this.poManager = new POManager(this.page)
    }

    async userLogin({ email, password }: { email: string, password: string }) {

        const loginPage = this.poManager.getLoginPage()
        await this.page.goto('https://rahulshettyacademy.com/client')
        await loginPage.loginSuccess({ email: email, password: password })
    }

    async incorrectLogin({ email, password }: { email: string, password: string }) {
        const loginPage = this.poManager.getLoginPage()
        await this.page.goto('https://rahulshettyacademy.com/client')
        await loginPage.loginIncorrect({ email: email, password: password })

    }

    async selectTopMenuOption({ option }: { option: TOPOPTIONS }) {
        const topMenu = this.poManager.getTopMenu()
        await topMenu.clickTopOption({ option: option })
    }

    async completePayment({ cardNo, cvv, expireMonth, expireYear, cardName, coupon, email, country }:
        { cardNo: string, cvv: string, expireMonth: string, expireYear: string, cardName: string, coupon?: string, email?: string, country: string }): Promise<void> {
        const paymentMethod = this.poManager.getPaymentMethodPage()
        await paymentMethod.fillPersonalInformation({ cardNo: cardNo, cvv: cvv, expireMonth: expireMonth, expireYear: expireYear, cardName: cardName, coupon: coupon })
        await paymentMethod.fillShippingInformation({ email: email, country: country })
        await paymentMethod.clickPlaceOrder()
    }
} export default UtilsUI








