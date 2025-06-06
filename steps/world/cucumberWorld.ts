import { setWorldConstructor, World } from '@cucumber/cucumber'
import { Pickle } from '@cucumber/messages'
import { APIRequestContext, Browser, BrowserContext, Page, PlaywrightTestOptions } from '@playwright/test'
import POManager from '../../src/pageObjects/POManager'

export interface CustomWorldBeforeSetup extends World {
    context?: BrowserContext
    page?: Page
    pickle?: Pickle
    browser?: Browser
    poManager?: POManager
}
class TestWorld extends World implements CustomWorldBeforeSetup {
    debug = false
}
setWorldConstructor(TestWorld)

export interface CustomWorld extends CustomWorldBeforeSetup {
    context: BrowserContext
    page: Page
    pickle: Pickle
    browser: Browser
    poManager: POManager
}
