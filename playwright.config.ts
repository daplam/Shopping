import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// TO RUN A CUSTOM CONFIG FILE USE --config filename.ts 
//ex. npx playwright test cart2.spec.ts --config playwright.config1.ts

// TO RUN A SPECIFIC PROJECT USE project=projectname
//ex.npx playwright test cart2.spec.ts--config playwright.config1.ts --project=firefox

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  //reporter: [["line"]],
  reporter: [
    ['allure-playwright', {
      resultsDir: 'allure-results/specs',  // Make sure path is correct
      detail: true,
      suiteTitle: true
    }]
  ],
  timeout: 4 * 10000,
  //workers: 2,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  expect: {
    timeout: 5000
  },
  testDir: './tests',
  // if test fails, it will retry to test it again 1 time
  retries: 1,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //screenshot: 'on',
    trace: 'retain-on-failure', // 'retain-on-failure' - to trace only when fails // on/off -- on trace all
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        ...devices['Desktop Chrome'],
        headless: false,
        //video: 'retain-on-failure', //Record video for each test, but remove all videos from successful test runs
        viewport: { width: 1280, height: 720 }, // open the browser in the specific size input
        ignoreHTTPSErrors: true // ignore SSL errors. When there is message that Connection is not private and is needed to go to go to advanced and accept in the browser
      }
    },

    /* {
       name: 'chromiumResponsive',
       use: {
         browserName: 'chromium',
         ...devices['Pixel 7'], //// open the browser with size of the selected device
         headless: false,
       }
     },*/

    /* {
       name: 'firefox',
       use: { ...devices['Desktop Firefox'] },
     },
 
     {
       name: 'webkit',
       use: { ...devices['Desktop Safari'] },
     },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
