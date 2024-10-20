/// <reference types = "cypress" />

describe('User registration and account delete', () => {

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

        cy.get('[data-qa="days"]').then( item => {
            cy.wrap(item).find('option').first()
                .should('contain', 'Day')
                .invoke('prop', 'selected')
                .should('eq', true)

            cy.wrap(item).select('5').should('contain', "5")
            cy.wrap(item).find('option').eq(5).invoke('prop', 'selected').should('eq', true)
            cy.wrap(item).children().should('have.length', 32)
        })
        
        cy.get('[data-qa="months"]').then( item => {
            cy.wrap(item).find('option').first()
                .should('contain', 'Month')
                .invoke('prop', 'selected')
                .should('eq', true)

            cy.wrap(item).select('March').should('contain', "March")
            cy.wrap(item).find('option').eq(3).invoke('prop', 'selected').should('eq', true)
            cy.wrap(item).children().should('have.length', 13)
        })

        cy.get('[data-qa="years"]').then( item => {
            cy.wrap(item).find('option').first()
                .should('contain', 'Year')
                .invoke('prop', 'selected')
                .should('eq', true)

            cy.wrap(item).select('1990').should('contain', "1990")
            cy.wrap(item).find('option').eq(32).invoke('prop', 'selected').should('eq', true)
            cy.wrap(item).children().should('have.length', 123)
	    });

        cy.get('[data-qa="days"] option').then( optionList => {

            
            for (let index = 0; index < optionList.length; index++) {
                const item = optionList[index];
                console.log(item.value);
            }
        })
        
    })

})
