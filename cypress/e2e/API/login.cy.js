describe('Login Page API Tests', () => {
  it('Email and Password Fields Empty', () => {
    const payload = {
      email: '',
      password: '',
      staySignedIn: false,
    };

    cy.request({
      method: 'POST',
      url: 'https://app.ninjarmm.com/ws/account/login',
      body: payload,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.statusText).to.eq("Bad Request");
      const messages = response.body.map(item => item.message);
      
      expect(messages).to.include('Email field can not be empty');
      expect(messages).to.include('Password field can not be empty');
    });
});

  it('Email Field Empty', () => {
    const payload = {
      email: '',
      password: 'Ricochete123$',
      staySignedIn: false,
    };

    cy.request({
      method: 'POST',
      url: 'https://app.ninjarmm.com/ws/account/login',
      body: payload,
      failOnStatusCode: false
    }).then((response) => {
      cy.spok(response, {
        status: 400,
        body: {
          0: {
            message: "Email field can not be empty"
          }
        }
      })
      expect(response.status).to.eq(400);
      expect(response.body[0].message).to.eq("Email field can not be empty");
    });
  });

  it('Password Field Empty', () => {
    const payload = {
      email: 'ninja@ninja.com',
      password: '',
      staySignedIn: false,
    };

    cy.request({
      method: 'POST',
      url: 'https://app.ninjarmm.com/ws/account/login',
      body: payload,
      failOnStatusCode: false
    }).then((response) => {
      cy.spok(response, {
        status: 400,
        body: {
          0: {
            message: "Password field can not be empty"
          }
        }
      })
    });
  });

  it('Wrong Credentials - Human Verification', () => {
    cy.generateRandomEmail().then((email) => {
      const payload = {
        email: email,
        password: 'Ninja!23$',
        staySignedIn: false,
      };

      let status;
      function attemptLogin() {
        cy.login(payload).then(() => {
        cy.get('@loginResponse').then((response) => {
          status = response.status;
          if (status === 400) {
            cy.spok(response, {
              body: {
                recaptchaRequired: true,
                resultCode: 'HUMAN_VERIFICATION_FAILED'
              },
              statusText: 'Bad Request'
            })
          } else {
            attemptLogin();
          }
        });
      });
    }

    attemptLogin();
  })
  });

  it('Wrong Credentials - Authentication Failure', () => {
    cy.generateRandomEmail().then((email) => {
      const payload = {
        email: email,
        password: 'ninja!23$',
        staySignedIn: false,
      };

      cy.request({
        method: 'POST',
        url: 'https://app.ninjarmm.com/ws/account/login',
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        if (response.body.recaptchaRequired === true){
          expect(response.status).to.eq(400);
          expect(response.body.resultCode).to.eq("HUMAN_VERIFICATION_FAILED")
        } else {
          cy.spok(response.body, {
            recaptchaRequired: false,
            resultCode: "AUTHENTICATION_FAILURE"
          })
        }
      });
    })
  });

    

  it.skip('Successfull Login - Remember Me', () => {
    
      const payload = {
        email: "rpolanski@live.com",
        password: "Ricochete123$",
        recaptchaToken: "03AFcWeA7rF212lBNvhUPJwLpw8InPZ8QI1o83TRRdcgTTIRPhd2mDeH8gE8v9nkqyiwzglmquP4Kap-3rB3GZ1X51mwkK6q4oqN2HtP-KwrRFpxb8VKcV2qRGuyhHMEwxSzPE8UM8Pw_GhssKPU-E_WuHFMsj787nI_lKMWXF8uo2AWR_arqZFW81E5hcN5cASBjp10Uj2ndCKXRD3LyuooKn5dooMvJHV46h6_1SIeSB0IbTZmG66jMTVUoltiX4zfUtyNxPHkHgTJaW38AR1PX42GOptW84M3kTd4PNp1t_6Dgo4ysww7MoUv4aB55W-ag6QbDjSELM3h5g3Ha36OqKuTN7Tpd4A679DoNmPbXUgoZY0cfufAlB52T-_ljobRInsVzuQSLwnTWIPX1b85qrccwiXygjkzKG0J7RUyGBAKoA9sKsDDMh5Rny5nUaf6xuvWv1K6AQ6MBZyfmuQD9ZecPboNqkOPlq8jqg6X_wY1lWlbY7rJrj8Ag7P6rp8Xnvov9PDAKXJ3CXJKLIKwP19CESGW1iX15izL4tPXpEHQUFMJLJY6_K57p00pqCQuMbhBgWSzkUD84zba2t8RlY-0zJtlx2ToToS36GhM9YFUmTCVslufMDSHe9tRD6kbqeC1pNPUMjVT8ujQK_RyODmmFwTmBvn2D8WFhWjrkaFh5pxXbj-TmaApwtcwndIhcVa8dg5WmlkjKhPBWzpEhT21GN0tXjVI07srAvp8wQWzLwuZ0Ur637uL6u1PxfYGMVWFE1h7KqJUFOGqiNiRH0c9ObNdNcBIilU1ht9paEAoWRpBw3o9dBpigEWVjXpx6V1Q_dL0xJmb2rD_QqMegihnT9zLd0DP79tUVf9fpzzOBL9s-uPlxyAwZmNFx_XAKdRpFYG4B0Ov-TudLDu6t_Sh1lR2qAZNatol9-7sbB2mAiZQJftqOocc734VU9fL8qNRzKRpL5KSy_HqI6TYLLBZrw4sjzA3UMhj04Z7eHXKpO6laq5H3ZcMsH9mptszx1ZUYyG9-mxfxALIfGFaapvgugZZqwfPtq1pGFZdfFXqNWnIqgBtP9oG8vVQVv_D_F0O3BGD0sLm4TB2FrdOwsbO2OvT1kmNvUP_mjN1QqVVEkUGgTUtFV079wfWuhRRTO1xwqP0o1IVKvmElFuVLWmoqtI020tkil3FTJWxfWRGwWYrtSCWOP04W8gIrShjRF3vrA2URFA37UXl_qUAUyL86b76Qz2IT7xfXC7k7mQUFvSNtWjzt-ZjrILOmYbJAQutnjOQmtrAywyrqBVm5upUPnXQ0Ytt-qmeYMb0D281w9VV-idwlRKe1kPxNZ4cBDpt-G5X0og8JFd0eouy_-Hmqm1vGzyX4OKHw-1WyQcmXOjUAOEuVLGAql0C6MktMlitl7Cm7O3a13DrYHtAwkoanE-zR9D9LvJGd2zei5tOU2x4IEIQw0nvWN9gc2yDtwJYt9jfK_ZON9FnF8-CMB6g2Zp3g9OZSqLiIsGd3uJLNyqBFuQS7tZoPhESLZOAqszAP5kFhhxpvRXlbRb-26NYIKTcrnbUAsctuL40ZBoaP_4vBuHBvQutyzc-KnmM8q9Y2njrLTgJNOMZQMVeMF-O4emuF9UIBBvjyhkTnFDJSOgr__N8MdbCZW5aqCDD8zZE53ZVKzIjTjaPeUqZvYA4MWn6lZnNUdV3S1NfRNMF27pcXq7PJ5R7ycmfDb0KSfno4lechS1tqnGeBErUcEWFJCA9cB-GLly6Lfr08vfF8Oz37zHr7xTbmoupf9C3o5h8Hn4HIS_cLLArtrJsCcrWvq7uh09BPmpoCrr9fLQnIwAZyPswKCLGUZB5PnZzzw95c52d-6ucD4Z4YGH7HbFP0GhRwpsl5fEIxgw4Y9NO4jTUcqIWQ",
        staySignedIn: true
      };

      const recaptchaUrl = 'https://www.recaptcha.net/recaptcha/enterprise/reload?k=6LfU_ewjAAAAALijOMmbngnUNShlrhRauhUdACO-';

        cy.request({
            method: 'POST',
            url: recaptchaUrl,
            headers: {
              'Content-Type': 'application/x-protobuffer', 
              'Accept': '*/*',
              'Accept-Encoding': 'gzip, deflate, br, zstd',
              'Accept-Language': 'en-US,en;q=0.9',
              'Origin': 'https://www.recaptcha.net',
              'Referer': 'https://www.recaptcha.net/recaptcha/enterprise/anchor?ar=1&k=6LfU_ewjAAAAALijOMmbngnUNShlrhRauhUdACO-&co=aHR0cHM6Ly9hcHAubmluamFybW0uY29tOjQ0Mw..&hl=en&v=xds0rzGrktR88uEZ2JUvdgOY&size=invisible&cb=h6brqtc7heil',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
              
          },
            failOnStatusCode: false 
        }).then((response) => {
          expect(response.status).to.eq(200); 
        });

      cy.request({
        method: 'POST',
        url: 'https://app.ninjarmm.com/ws/account/login',
        body: payload,
        failOnStatusCode: false
      }).then((response) => {
        cy.spok(response, {
          body: {
            available_mfa: "5106"
          }
        })
      });
    })
});