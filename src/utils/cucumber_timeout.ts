import { setDefaultTimeout } from "@cucumber/cucumber";

// load env variables from .env file
import { config as loadEnv } from "dotenv"
const env = loadEnv({ path: './env/.env' })

const cucumberTimeout = parseInt(env.parsed?.CUCUMBER_TIMEOUT || '60000')

setDefaultTimeout(cucumberTimeout)