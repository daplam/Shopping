import test, { expect } from "@playwright/test";

test('TC01 - Visual validation', async ({ page }) => {

    await page.goto('https://www.tiktok.com/es/')
    await page.waitForTimeout(3000)
    expect(await page.screenshot()).toMatchSnapshot('landing.png')
});