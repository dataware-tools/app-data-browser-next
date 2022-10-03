/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginByAuth0Api: () => void;
    }
  }
}

Cypress.Commands.add("loginByAuth0Api", () => {
  const username = Cypress.env("auth0Username");
  const password = Cypress.env("auth0Password");
  const client_id = Cypress.env("auth0ClientId");
  const client_secret = Cypress.env("auth0ClientSecret");
  const audience = Cypress.env("auth0Audience");

  cy.request({
    method: "POST",
    url: `https://${Cypress.env("auth0Domain")}/oauth/token`,
    body: {
      grant_type: "password",
      username,
      password,
      audience,
      client_id,
      client_secret,
    },
  }).then(({ body }) => {
    console.log(body);

    window.localStorage.setItem("auth0TokenOnCypress", body.access_token);
  });
});

export {};
