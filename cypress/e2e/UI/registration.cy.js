describe('NinjaRMM Login Page', () => {
    it('should load the login page', () => {
      cy.visit('https://app.ninjarmm.com/auth/#/register');
  
      cy.get('input[name="organization"]').should('be.visible').focus().type('Ninja testing').should('have.value', 'Ninja testing');
      cy.get('input[name="firstName"]').should('be.visible').focus().type('Ricardo').should('have.value', 'Ricardo');
      cy.get('input[name="lastName"]').should('be.visible').focus().type('Alves').should('have.value', 'Alves');
      cy.generateRandomEmail().then((email) => {
        cy.get('input[name="email"]').should('be.visible').focus().type(email).should('have.value', email);
      })
      cy.generateRandomPassword().then((password) => {
        cy.get('input[name="password"]').should('be.visible').focus().type(password).should('have.value', password);
        cy.get('input[name="passwordConfirm"]').should('be.visible').focus().type(password).should('have.value', password);
      })
      cy.get('.PhoneInputCountrySelect').select('BR')
      cy.get('input[type="tel"]').should('be.visible').focus().type("41984005106").should('have.value', "(41) 98400-5106");

      cy.get('button[type="submit"]').should('be.visible').click() 

      cy.get('.css-bk160n').contains("Account successfully created. Please check your email to activate your account.")
    });
  });