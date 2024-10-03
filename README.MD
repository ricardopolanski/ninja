# Cypress Testing Setup

This repository contains Cypress tests for **Ninja Automation Test**. Follow the instructions below to install Cypress and run the tests in both interactive and headless modes.

## Table of Contents

- [Installation](#installation)
- [Running Tests](#running-tests)
  - [Interactive Mode](#interactive-mode)
  - [Headless Mode](#headless-mode)

## Installation

To get started with Cypress, you need to install the necessary dependencies. Run the following command in your terminal:

npm i

This command will install Cypress and save it as a development dependency in your `package.json` file.

## Running Tests

### Interactive Mode

To open Cypress in interactive mode, run the following command:

npm cypress open


This will launch the Cypress Test Runner, where you can choose which tests to run and view the results in real-time.

### Headless Mode

To run your tests in headless mode, use the following command:

npx cypress run


This command will execute all tests in the background without opening the Test Runner. The results will be displayed in your terminal.

## API Tests Status

Please note that the API tests are not 100% developed. This is primarily due to challenges in handling the reCAPTCHA feature, which complicates automated testing. As a result, certain functionalities may not be fully covered by the tests at this time. We are actively exploring solutions to address this limitation.

## Conclusion

You are now ready to run Cypress tests for your project! If you have any questions or issues, please feel free to reach out.
