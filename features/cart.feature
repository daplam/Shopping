Feature: Your orders Page

    Background: Open browser
        Given the user navigates to login page

    @EmptyCar
    Scenario: Cart empty
        Given the user logins with user the role "user1"
        When the user navigates to Cart option
        Then the cart displays message that is empty
