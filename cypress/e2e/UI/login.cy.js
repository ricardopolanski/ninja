describe('Ninja Login Page', () => {
    it('Should log in succesfully', () => {
      cy.visit('https://app.ninjarmm.com/auth/#/login');
  
      cy.get('input[name="email"]').should('be.visible').focus().type('rpolanski@live.com').should('have.value', 'rpolanski@live.com');

      cy.get('input[name="password"]').should('be.visible').focus().type('Ricochete123$')
      cy.intercept('POST', '/ws/account/login').as('loginRequest');

      cy.wait(5000); 


      cy.get('button[type="submit"]').should('be.visible').click() 

      cy.wait('@loginRequest').then((interception) => {
        console.log(interception);
        cy.spok(interception.response, {
            body: {
                available_mfa: {
                    SMSOTP: "5106"
                },
                resultCode: "MFA_REQUIRED"
            },
            statusCode: 200
            
        })
      });

      cy.url().should('include', '/mfa');

    });
  });