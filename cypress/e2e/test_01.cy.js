/// <reference types = "cypress" />

describe('User registration', () => {


	it('registrate new user', () => {
		cy.visit('/');
        cy.contains('Signup / Login').click()

        cy.get('.signup-form h2').should('contain', 'New User Signup!')

        cy.readJson('data.json').then((data) => {
            cy.get('.signup-form form').then( form => {
                cy.wrap(form).find('[data-qa="signup-name"]').type(data.name)
                cy.wrap(form).find('[data-qa="signup-email"]').type(data.email)
                cy.wrap(form).find('[data-qa="signup-button"]')
                cy.wrap(form).find('button').click()
            })
        })
        

        cy.get('.login-form h2').should('be.visible').should('contain', 'Enter Account Information')

        console.log(cy.get('.login-form h2').should('be.visible'));

        cy.get('#id_gender2').check()
        cy.get('#id_gender2').invoke('prop', 'checked').should('eq', true)

        cy.get('#id_gender1').check()
        cy.get('#id_gender1').invoke('prop', 'checked').should('eq', true)

        cy.readJson('data.json').then((data => {
            cy.get('[data-qa="name"]').invoke('attr', 'value').should('eq', data.name)
            cy.get('[data-qa="email"]').invoke('attr', 'value').should('eq', data.email)
            cy.get('[data-qa="password"]').invoke('attr', 'value').should('eq', '')
            cy.get('[data-qa="password"]').type(data.password).invoke('prop', 'value').should('eq', data.password)
        }))
        
	});
});
