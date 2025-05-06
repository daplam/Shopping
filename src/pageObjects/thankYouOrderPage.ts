import { expect, Locator, Page } from "@playwright/test";

class ThankYouPage {
    page: Page
    orderNum: Locator

    private readonly texts: {
        notAuthorized: Locator
    }

    private readonly toast: {
        orderNotFound: Locator
        notFoundClass: Locator
    }

    constructor(page: Page) {
        //super(page);
        this.page = page
        this.orderNum = page.locator('label.ng-star-inserted')
        this.texts = {
            notAuthorized: page.getByText('You are not authorize to view this order')
        }
        this.toast = {
            orderNotFound: page.getByLabel('Order not found'),
            notFoundClass: page.locator('.toast-message')
        }
    }

    async getOrdersId() {
        await this.page.getByRole('heading', { name: ' Thankyou for the order. ' }).waitFor()
        let ordersId: string[] = await this.orderNum.allInnerTexts()
        ordersId = ordersId.map(acc => acc.replaceAll('|', '').trim())
        return ordersId
    }

    async notAuthorized() {
        await expect(this.texts.notAuthorized).toBeVisible()
        await expect(this.toast.orderNotFound).toBeVisible()
        await expect(this.toast.notFoundClass).toHaveText(' Order not found ')


    }

} export default ThankYouPage