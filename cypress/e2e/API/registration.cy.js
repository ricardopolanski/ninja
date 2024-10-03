// needs the recaptcha to run this test. will be skipped as well
describe('Registration Page API Tests', () => {
    it.skip('Register new account', () => {
      const payload = {
        email: '',
        password: '',
        staySignedIn: false,
      };
  
      cy.request({
        method: 'POST',
        url: 'https://app.ninjarmm.com/ws/account/register',
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        console.log(response);
        expect(response.status).to.eq(400);
        expect(response.statusText).to.eq("Bad Request");
        const messages = response.body.map(item => item.message);
        
        expect(messages).to.include('Email field can not be empty');
        expect(messages).to.include('Password field can not be empty');
      });
  });
});