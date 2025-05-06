import test from "@playwright/test";
import UtilsUI from "../../src/utils/utilsUI";

test('@API TC01 - Block calls', async ({ page }) => {

    //const poManager = new POManager(page)
    //const loginPage = poManager.getLoginPage()
    const utils = new UtilsUI(page)

    const loginMail = 'starwayheavengod@gmail.com'
    const password = 'Alejandro.123'

    //blocks CSS - **/* means any webpage
    page.route('**/*.css', route => route.abort())

    //ex. if want to block the images
    page.route('**/*.{jpg,png,jpeg}', route => route.abort())


    //page.on() is used to listen for various events like requests, responses, console messages, page errors, etc.

    // listen all request calls made from browser to backend API.
    //In this ex. is just bringing the url requests
    //page.on('request', request => console.log(request.url()))

    //if want to listen the status code , it comes from the response
    //when any network call have response, listen with the next line, get the url of the response you want, and also ask the status
    page.on('response', response => console.log(response.url(), response.status()))
    await utils.navigateTo()
    await utils.userLogin({ email: loginMail, password: password })

});