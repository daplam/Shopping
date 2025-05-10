module.exports = {
    default: {
        require: [
            'tests/features/step-definitions/**/*.ts',
            'tests/features/support/**/*.ts',
            'steps/**/*.ts'
        ],
        requireModule: ['ts-node/register'], // Execute Typescript real time
        format: [
            'progress', // Show progress in console
            "allure-cucumberjs/reporter"
        ],
        formatOptions: {
            resultsDir: 'allure-results/cucumber' // Specific folder for cucumber reports
        },
        paths: ['features/**/*.feature'], // Path where .feature files are located
        timeout: 30000, // Timeout 30 seconds
        tags: 'not @ignore', // Exclude test with tag @ignore
    }
};
