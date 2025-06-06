import { Page } from "@playwright/test";

// load env variables from .env file
import { config as loadEnv } from "dotenv"
const env = loadEnv({ path: './env/.env' })

export function setGlobalSettings(page: Page) {

    const navigationTimeout = parseInt(env.parsed?.NAVIGATION_TIMEOUT || '4000')
    const commandTimeout = parseInt(env.parsed?.COMMAND_TIMEOUT || '3000')

    //GLOBAL NAVIGATION TIMEOUT
    page.setDefaultNavigationTimeout(navigationTimeout)

    //COMMAND TIMEOUT
    page.setDefaultTimeout(commandTimeout)
}