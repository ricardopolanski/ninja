describe('Forgot Password Test', () => {
    it('Should Send Out Reset Email', () => {
      cy.visit('https://app.ninjarmm.com/auth/#/resetPassword');
  
      cy.get('.css-yk16xz-control').click()
      cy.contains('Text').click();
      cy.get('input[name="email"]').should('be.visible').focus().type('rpolanski@live.com').should('have.value', 'rpolanski@live.com');
      cy.get('input[name="phone"]').should('be.visible').focus().type('5106').should('have.value', '5106');
      cy.get('button[type="submit"]').should('be.visible').click()
      cy.get('.css-h74niu').should('be.visible').contains('Enter Security Code', { timeout: 10000 })
    });
  });