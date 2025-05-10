import { expect, Locator, Page } from "@playwright/test";

class YourOrdersPage {

    page: Page

    private readonly buttons: {
        view: Locator
        delete: Locator
        goBackShop: Locator
        goBackCart: Locator
    }

    private readonly texts: {
        tableTitle: Locator
        noOrders: Locator
    }

    constructor(page: Page) {
        this.page = page

        this.buttons = {
            view: page.getByRole('button'),
            delete: page.getByRole('button'),
            goBackShop: page.getByRole('button', { name: 'Go Back to Shop' }),
            goBackCart: page.getByRole('button', { name: 'Go Back to Cart' })
        }

        this.texts = {
            tableTitle: page.getByRole('heading', { name: 'Your Orders' }),
            noOrders: page.getByText(' You have No Orders to show at this time. Please Visit Back Us ')
        }
    }

    async clickGoBackToShop() {
        await this.buttons.goBackShop.click()
    }

    async clickGoBackToCart() {
        await this.buttons.goBackCart.click()
    }

    async verifyOrder({ orderId }: { orderId: string[] }) {
        await this.page.getByRole('heading', { name: 'Your Orders' }).waitFor()
        let allOrders: string[] = await this.getOrders()
        //OPTION WITH 1 LINE
        await expect(orderId.every(element => allOrders.includes(element))).toBe(true)

        // The every() method is used on arrays to check whether all elements in the array exist in the other array
        //Returns true if all elements pass the test implemented by the callback function.
        //Returns false as soon as one element fails the test.

        //OPTION IN 2 LINES
        //const coincidence = orderId.every(element => allOrders.includes(element)) // check if allOrders includes all elements of orderId
        //await expect(coincidence).toBe(true) 



        /* OPTION WITH FOR LOOP

        console.log('Total records: ' + orderId.length)
        let flag: boolean

        for (let i = 0; i < orderId.length; i++) {
            console.log('Row order:<' + allOrders + '>')
            console.log('text content <' + orderId[i] + '>')
            if (await allOrders.includes(orderId[i])) {
                console.log('Match>' + orderId[i])
                // expect(await rowContents.nth(1).textContent()).toEqual(productName)
                //console.log(await rowContents.nth(1).textContent())
                //break
                flag = true
            }
            else {
                flag = false
            }
            await expect(flag).toBe(true)
        }
        //await expect(flag).toBe(true) */
    }

    async getOrders() {
        await this.page.getByRole('heading', { name: 'Your Orders' }).waitFor()

        const tableBody = await this.page.locator('tbody')
        const tableRows = await tableBody.locator('tr')
        const totalRows = await tableRows.count()
        //console.log('Total rows: ' + totalRows)

        let arr: string[] = []

        return arr = [...await tableRows.locator('th').allInnerTexts()]

        //option 2
        /* if (tableBody) {
             for (let i = 0; i < totalRows; i++) {
                 const rowOrder = await tableRows.locator('th')
                 //arr.push(rowOrder[i].textContent)
                 arr.push(await rowOrder.nth(i).innerText())
             }
         }*/
    }

    async viewOrder({ orderId }: { orderId?: any } = {}) {
        //await this.page.getByRole('heading', { name: 'Your Orders' }).waitFor()
        //await console.log(await this.page.url())
        await this.page.waitForURL(/.*myorders/, { waitUntil: 'networkidle' })
        /* await expect(await this.page).toHaveURL(/.*myorders/);
         await this.page.waitForLoadState('networkidle');*/

        if (orderId) {
            if (await this.texts.tableTitle.isVisible()) {
                const tableBody = await this.page.locator('tbody')
                const tableRows = await tableBody.locator('tr')
                const totalRows = await tableRows.count()
                //console.log('Total rows: ' + totalRows)
                //console.log(orderId)

                for (let i = 0; i < totalRows; i++) {
                    const rowContents = await tableRows.nth(i).locator('td')
                    const rowOrder = await tableRows.nth(i).locator('th')
                    //console.log('Row order:<' + await rowOrder.textContent() + '>')
                    if (orderId == (await rowOrder.textContent())) {
                        //console.log(await rowContents.nth(1).textContent())
                        //console.log('Row order:<' + await rowOrder.textContent() + '>')
                        this.buttons.view = rowContents.nth(4).getByText('View')
                        break
                    }
                }
                await this.buttons.view.click()
                await expect(this.page.getByText('Thank you for Shopping With Us')).toBeVisible()
                await expect(this.page.getByText('order summary')).toBeVisible()

            }
            else {
                await expect(await this.texts.noOrders).toBeVisible()
            }
        }
        else {
            await this.buttons.view.getByText('View').first().click()
        }




    }

    async deleteOrder({ orderId }: { orderId: any }) {
        await this.page.getByRole('heading', { name: 'Your Orders' }).waitFor()

        const tableBody = await this.page.locator('tbody')
        const tableRows = await tableBody.locator('tr')
        const totalRows = await tableRows.count()
        console.log('Total rows: ' + totalRows)
        console.log(orderId)

        for (let i = 0; i < totalRows; i++) {
            const rowContents = await tableRows.nth(i).locator('td')
            const rowOrder = await tableRows.nth(i).locator('th')
            //console.log('Row order:<' + await rowOrder.textContent() + '>')
            if (orderId == (await rowOrder.textContent())) {
                console.log(await rowContents.nth(1).textContent())
                console.log('Row order:<' + await rowOrder.textContent() + '>')
                this.buttons.delete = rowContents.nth(5).getByText('Delete')
                break
            }
        }
        await this.buttons.delete.click()
        await expect(await this.page.getByLabel('Orders Deleted Successfully')).toBeVisible()
    }

} export default YourOrdersPage