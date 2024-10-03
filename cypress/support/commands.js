import spok from 'cy-spok'
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { asdf })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add(
    'login',
    (payload) => {
      cy.request({
        method: 'POST',
        url: 'https://app.ninjarmm.com/ws/account/login',
        body: payload,
        failOnStatusCode: false,
      }).as('loginResponse');
    },
  );

  Cypress.Commands.add('generateRandomPassword', () => {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
    const generatePassword = () => {
      const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
      const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
      
      const passwordLength = getRandomInt(8, 72);
      const passwordArray = [
        lowerChars.charAt(getRandomInt(0, lowerChars.length - 1)), // at least one lowercase
        upperChars.charAt(getRandomInt(0, upperChars.length - 1)), // at least one uppercase
        numbers.charAt(getRandomInt(0, numbers.length - 1)), // at least one number
        specialChars.charAt(getRandomInt(0, specialChars.length - 1)), // at least one special character
      ];
  
      // Fill the rest of the password length with random characters
      const allChars = lowerChars + upperChars + numbers + specialChars;
      for (let i = passwordArray.length; i < passwordLength; i++) {
        passwordArray.push(allChars.charAt(getRandomInt(0, allChars.length - 1)));
      }
  
      // Shuffle the password array to ensure randomness
      return passwordArray.sort(() => Math.random() - 0.5).join('');
    };
  
    return generatePassword();
  });

  Cypress.Commands.add('generateRandomEmail', (chance = 0.5) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const domains = ['example.com', 'test.com', 'sample.com'];
    let localPart = '';
    for (let i = 0; i < 10; i++) {
      localPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    let domain;
    if (Math.random() < chance) {
      domain = domains[Math.floor(Math.random() * domains.length)];
    } else {
      domain = 'default.com';
    }
  
    return `${localPart}@${domain}`;
  });

Cypress.Commands.add(
    'spok',
    (dataObjectOrAlias, expectedAssertion) => {
      const handleDataObject = (dataObject) => {
        // cy.step(
        //   `Verify data object:\n${JSON.stringify(dataObject, null, 2)}\nis equal to expected assertion:\n${JSON.stringify(
        //     expectedAssertion,
        //     null,
        //     2,
        //   )}`,
        // );
  
        const verifyObjectAssertions = (responseBody, expectedObject) => {
          if ('data' in expectedObject) {
            const topLevelAssertions = { ...expectedObject };
            delete topLevelAssertions.data;
  
            cy.wrap(responseBody).should(spok(topLevelAssertions));
  
            if (
              responseBody.data &&
              Array.isArray(expectedObject.data)
            ) {
              responseBody.data.forEach((item, index) => {
                const itemAssertion =
                  expectedObject.data.length > index
                    ? expectedObject.data[index]
                    : expectedObject.data[0];
                cy.wrap(item).should(spok(itemAssertion));
              });
            } else if (
              responseBody.data &&
              typeof expectedObject.data === 'object' &&
              expectedObject.data !== null
            ) {
              cy.wrap(responseBody.data).should(spok(expectedObject.data));
            }
          } else if ('body' in dataObject) {
            console.log(dataObject)
            cy.wrap(dataObject)
              .its('body')
            //   .should(spok(expectedAssertion));
          } else {
            Object.keys(expectedObject).forEach((key) => {
              if (Array.isArray(expectedObject[key])) {
                responseBody[key].forEach((item, index) => {
                  const itemAssertion =
                    expectedObject[key].length > index
                      ? expectedObject[key][index]
                      : expectedObject[key][0];
                  cy.wrap(item).should(spok(expectedAssertion));
                });
              }
            });
          }
        };
  
        if (
          typeof dataObject === 'number' ||
          (typeof dataObject === 'string' &&
            typeof expectedAssertion === 'number') ||
          typeof expectedAssertion === 'string'
        ) {
          cy.wrap(dataObject).should('equal', expectedAssertion);
        } else {
          const responseBody = Cypress._.get(dataObject, 'body', null);
          if (responseBody !== null) {
            verifyObjectAssertions(responseBody, expectedAssertion);
          } else {
            verifyObjectAssertions(dataObject, expectedAssertion);
          }
        }
      };
  
      if (
        typeof dataObjectOrAlias === 'string' &&
        dataObjectOrAlias.startsWith('@')
      ) {
        cy.get(dataObjectOrAlias).then((response) => handleDataObject(response));
      } else {
        handleDataObject(dataObjectOrAlias);
      }
  
      if (
        typeof dataObjectOrAlias === 'object' &&
        typeof expectedAssertion === 'object'
      ) {
        cy.wrap(dataObjectOrAlias).should(spok(expectedAssertion));
      }
    },
  );