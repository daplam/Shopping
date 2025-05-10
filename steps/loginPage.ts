import { Given, setDefaultTimeout, Then } from '@cucumber/cucumber'
import UtilsUI from '../src/utils/utilsUI';


Given('the user navigates to login page', async function () {
    // Write code here that turns the phrase above into concrete actions
    const utils: UtilsUI = new UtilsUI(this.page)
    await utils.navigateTo()
});


Given('the user logins with user the role {string}', async function (role) {
    const utils: UtilsUI = new UtilsUI(this.page)
    await utils.LoginbyRole({ role: role })
});


Given('the user logins with a user for scenario {string}', async function (scenario) {
    const utils: UtilsUI = new UtilsUI(this.page)
    const message = await utils.loginByScenario({ scenario: scenario })
    this.message = message

});

Then('message displayed is "{string}"', async function (expectedMessage) {
    if (await this.message.includes(expectedMessage)) {

        return true;
    } else {
        throw new Error(`Message expected: '${expectedMessage}', but was received message: '${this.message}'`);
    }
});
