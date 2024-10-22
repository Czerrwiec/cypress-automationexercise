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
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('readJson', (filePath) => {
    return cy.fixture(filePath);
  });

Cypress.Commands.add('userLogIn', (file) => {

    cy.readJson(file).then((data) => {;
        cy.contains('Signup / Login').click()
        cy.get('[data-qa="login-email"]').type(data.email)
        cy.get('[data-qa="login-password"]').type(data.password)
        cy.get('[data-qa="login-button"]').click()
        cy.get('.navbar-nav li').eq(3).should('contain', 'Logout')
    })
})
