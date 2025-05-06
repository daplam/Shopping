import { Page } from "@playwright/test";
import POManager from "../pageObjects/POManager";
import { TOPOPTIONS } from "../constants/constants";
import dataset from '../../testData/testLoginData.json';
import { Scenario } from '../types';  // Importando el tipo `Scenario`

export interface LoginData {
    username: string;
    password: string;
}

class UtilsUI {

    page: Page
    poManager: POManager

    constructor(page) {
        this.page = page
        this.poManager = new POManager(this.page)
    }

    async navigateTo() {
        await this.page.goto('https://rahulshettyacademy.com/client')
    }

    async userLogin({ email, password }: { email: string, password: string }) {

        const loginPage = this.poManager.getLoginPage()
        await loginPage.loginSuccess({ email: email, password: password })
    }

    async userLogOut() {
        const dashboard = this.poManager.getDashboardPage()
        await dashboard.signOut()
    }

    async incorrectLogin({ email, password }: { email: string, password: string }) {
        const loginPage = this.poManager.getLoginPage()

        await loginPage.loginIncorrect({ email: email, password: password })

    }

    async getLoginData(scenario: Scenario): Promise<LoginData> { //  with interface
        const data = dataset[scenario];
        //console.log(data)

        if (!data) {
            throw new Error(`Scenario not found: ${scenario}`);
        }
        return data;
    }

    async loginByScenario({ scenario }: { scenario: Scenario }) {
        const data = await this.getLoginData(scenario)
        switch (scenario) {
            case 'SuccessLogin':
                await this.userLogin({ email: data.username, password: data.password })
                break
            case 'MissingUsername':
            case 'MissingPassword':
            case 'MissingCredentials':
                await this.incorrectLogin({ email: data.username, password: data.password })
                break;
        }
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








