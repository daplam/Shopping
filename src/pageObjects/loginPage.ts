import { expect, Locator, Page } from "@playwright/test"
import { emit } from "process"

class LoginPage {

    page: Page

    private readonly inputs: {
        email: Locator
        password: Locator
    }

    private readonly buttons: {
        login: Locator
        forgotPassword: Locator
        register: Locator
        dontHaveAccount: Locator
        alreadyHaveAccount: Locator
    }

    private readonly labels: {
        emailRequired: Locator
        passwordRequired: Locator
        incorrectLogin: Locator
    }

    private readonly toast: {
        loginSuccessfully: Locator
    }

    constructor(page: Page) {
        this.page = page

        this.inputs = {
            email: page.locator('#userEmail'),
            password: page.locator('#userPassword')
        }

        this.buttons = {
            login: page.locator('#login'),
            forgotPassword: page.getByRole('link', { name: 'Forgot password?' }),
            register: page.getByRole('link', { name: 'Register' }),
            dontHaveAccount: page.getByText("Don't have an account ? "),
            alreadyHaveAccount: page.getByText('Already have an account? ')
        }

        this.labels = {
            emailRequired: page.getByText('*Email is required'),
            passwordRequired: page.getByText('*Password is required'),
            incorrectLogin: page.getByLabel('Incorrect email or password.')
        }

        this.toast = {
            loginSuccessfully: page.getByLabel('Login Successfully')
        }
    }

    async loginSuccess({ email, password }: { email: string, password: string }) {

        await this.inputs.email.waitFor({ state: 'visible' })
        await this.inputs.email.fill(email)
        await this.inputs.password.fill(password)
        await this.clickLoginBtn()
        await expect(this.toast.loginSuccessfully).toBeVisible()
        let msg = this.toast.loginSuccessfully.innerText()
        await this.page.waitForLoadState('networkidle')
        return msg
    }

    async loginIncorrect({ email, password }: { email?: string, password?: string }) {
        let errorMsg = ''
        await this.inputs.email.waitFor({ state: 'visible' })
        if (email && !password) {
            await this.inputs.email.fill(email)
            await this.clickLoginBtn()
            await expect(this.labels.passwordRequired).toBeVisible()
            const passwordRequiredLabel = await this.labels.passwordRequired.innerText();  // Obtenemos el texto del label
            errorMsg = passwordRequiredLabel;  // Guardamos el mensaje de error
        }
        if (!email && password) {
            await this.inputs.password.fill(password)
            await this.clickLoginBtn()
            await expect(this.labels.emailRequired).toBeVisible()
            const emailRequiredLabel = await this.labels.emailRequired.innerText()
            errorMsg = emailRequiredLabel
        }

        if (!email && !password) {
            await this.clickLoginBtn()
            await expect(this.labels.emailRequired).toBeVisible()
            await expect(this.labels.passwordRequired).toBeVisible()
            const emailRequiredLabel = await this.labels.emailRequired.innerText()
            const passwordRequiredLabel = await this.labels.passwordRequired.innerText()
            errorMsg = `${emailRequiredLabel}\n${passwordRequiredLabel}`
            console.log(errorMsg)
        }

        if (email && password) {
            await this.inputs.email.fill(email)
            await this.inputs.password.fill(password)
            await this.clickLoginBtn()
            await expect(this.labels.incorrectLogin).toBeVisible()
            const incorrectLoginLabel = await this.labels.incorrectLogin.innerText()
            errorMsg = incorrectLoginLabel;
        }
        return errorMsg;
    }

    async clickLoginBtn(): Promise<void> {
        await this.buttons.login.click()
    }

} export default LoginPage