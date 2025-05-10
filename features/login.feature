Feature: Your orders Page

    Background: Open browser
        Given the user navigates to login page

    @LoginByScenario
    Scenario Outline: Logins by scenario
        Given the user logins with a user for scenario "<Scenario>"
        Then message displayed is "<ExpectedMessage>"
        Examples:
            | Scenario           | ExpectedMessage                             |
            | SuccessLogin       | "Login Successfully"                        |
            | MissingUsername    | "Email is required"                         |
            | MissingPassword    | "Password is required"                      |
            | MissingCredentials | "*Email is required\n*Password is required" |
