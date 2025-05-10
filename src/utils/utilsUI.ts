import { Page } from "@playwright/test";
import POManager from "../pageObjects/POManager";
import { TOPOPTIONS } from "../constants/constants";
import dataset from '../../testData/testLoginData.json';
import { Scenario } from '../types';  // Import login and scenario types
import usersData from '../../testData/users.json'

export interface LoginData {
    username: string;
    password: string;
}

export interface Userdata {
    user: string;
    password: string;
    role: string;
}
const users: Userdata[] = usersData.usuarios;


class UtilsUI {

    page: Page
    poManager: POManager

    constructor(page: Page) {
        this.page = page
        this.poManager = new POManager(this.page)
    }

    async navigateTo() {
        await this.page.goto('https://rahulshettyacademy.com/client')
    }

    async userLogin({ email, password }: { email: string, password: string }) {

        let msg
        const loginPage = this.poManager.getLoginPage()
        msg = await loginPage.loginSuccess({ email: email, password: password })
        return msg
    }

    async getLogin(): Promise<Userdata[]> {
        // Return the user array directly from imported JSON
        return users;
    }

    async LoginbyRole({ role }: { role: string }): Promise<void> {
        try {
            // Get users directly from JSON file
            const users = await this.getLogin();

            // Search the user with the role sent
            const user = (await users).find((user) => user.role === role);

            if (!user) {
                throw new Error(`User not found with the role: ${role}`);
            }

            await this.userLogin({ email: user.user, password: user.password })

            // console.log(`Making login with user ${user.user} and role ${user.role}`);
            console.log(`Making login with role ${user.role}`);

        } catch (error) {
            console.error('Error getting data user:', error);
        }
    }

    async userLogOut() {
        const dashboard = this.poManager.getDashboardPage()
        await dashboard.signOut()
    }

    async incorrectLogin({ email, password }: { email: string, password: string }) {
        const loginPage = this.poManager.getLoginPage()
        let errorMsg
        errorMsg = await loginPage.loginIncorrect({ email: email, password: password })

        return errorMsg
    }

    async getLoginByScenario(scenario: Scenario): Promise<LoginData> { //  with interface
        const data = dataset[scenario];

        if (!data) {
            throw new Error(`Scenario not found: ${scenario}`);
        }
        return data;
    }

    async loginByScenario({ scenario }: { scenario: Scenario }) {
        const data = await this.getLoginByScenario(scenario)
        let message
        switch (scenario) {
            case 'SuccessLogin':
                message = await this.userLogin({ email: data.username, password: data.password })
                break
            case 'MissingUsername':
            case 'MissingPassword':
            case 'MissingCredentials':
                message = await this.incorrectLogin({ email: data.username, password: data.password })
                break;
        }
        return message
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








