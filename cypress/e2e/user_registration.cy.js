/// <reference types = "cypress" />

describe('User registration and account delete', () => {

    const listOfSelect = ['[data-qa="days"]', '[data-qa="months"]', '[data-qa="years"]', '[data-qa="country"]']

    function checkSelect(select, option) {
        cy.get(`${select} ${option}`).then( optionList => {
   
            for (let i = 1; i < optionList.length; i++) {
                const item = optionList[i];

                if (select == '[data-qa="months"]' || select == '[data-qa="country"]') {
                    cy.get(select)
                    .select(item.label)
                    .should('contain', item.label)
                } else {
                    cy.get(select)
                    .select(item.value)
                    .should('contain', item.value)
                }
                
            }
        })
    }


	it('Fill the form', () => {
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

        cy.get(listOfSelect[0]).then( item => {
            cy.wrap(item).find('option').first()
                .should('contain', 'Day')
                .invoke('prop', 'selected')
                .should('eq', true)

            cy.wrap(item).select('5').should('contain', "5")
            cy.wrap(item).find('option').eq(5).invoke('prop', 'selected').should('eq', true)
            cy.wrap(item).children().should('have.length', 32)
        })
        
        cy.get(listOfSelect[1]).then( item => {
            cy.wrap(item).find('option').first()
                .should('contain', 'Month')
                .invoke('prop', 'selected')
                .should('eq', true)

            cy.wrap(item).select('March').should('contain', "March")
            cy.wrap(item).find('option').eq(3).invoke('prop', 'selected').should('eq', true)
            cy.wrap(item).children().should('have.length', 13)
        })

        cy.get(listOfSelect[2]).then( item => {
            cy.wrap(item).find('option').first()
                .should('contain', 'Year')
                .invoke('prop', 'selected')
                .should('eq', true)

            cy.wrap(item).select('1990').should('contain', "1990")
            cy.wrap(item).find('option').eq(32).invoke('prop', 'selected').should('eq', true)
            cy.wrap(item).children().should('have.length', 123)
	    });   

        // listOfSelect.forEach(item => {
        //     checkSelect(item, 'option')
        // });
    
        cy.readJson('userRegistrationData.json').then((data) => {
            
            cy.get('[for="first_name"]').should('be.visible').and('contain', 'First name *')
            cy.get('[data-qa="first_name"]').type(data.firstName)
            cy.get('[data-qa="first_name"]').invoke('prop', 'value').should('eq', data.firstName)

            cy.get('[for="last_name"]').should('be.visible').and('contain', 'Last name *')
            cy.get('[data-qa="last_name"]').type(data.lastName)
            cy.get('[data-qa="last_name"]').invoke('prop', 'value').should('eq', data.lastName)

            cy.get('[for="company"]').should('be.visible').and('contain', 'Company')
            cy.get('[data-qa="company"]').type(data.company)
            cy.get('[data-qa="company"]').invoke('prop', 'value').should('eq', data.company)

            cy.get('[for="address1"]').should('be.visible').and('contain', 'Address *')
            cy.get('[data-qa="address"]').type(data.address)
            cy.get('[data-qa="address"]').invoke('prop', 'value').should('eq', data.address)

            cy.get('[for="address2"]').should('be.visible').and('contain', 'Address 2')
            cy.get('[data-qa="address2"]').type(data.address2)
            cy.get('[data-qa="address2"]').invoke('prop', 'value').should('eq', data.address2)

            cy.get('[for="state"]').should('be.visible').and('contain', 'State *')
            cy.get('[data-qa="state"]').type(data.state)
            cy.get('[data-qa="state"]').invoke('prop', 'value').should('eq', data.state)

            cy.get('[for="city"]').eq(0).should('be.visible').and('contain', 'City *')
            cy.get('[data-qa="city"]').type(data.city)
            cy.get('[data-qa="city"]').invoke('prop', 'value').should('eq', data.city)

            cy.get('[for="city"]').eq(1).should('be.visible').and('contain', 'Zipcode *')
            cy.get('[data-qa="zipcode"]').type(data.zipcode)
            cy.get('[data-qa="zipcode"]').invoke('prop', 'value').should('eq', data.zipcode)

            cy.get('[for="mobile_number"]').should('be.visible').and('contain', 'Mobile Number *')
            cy.get('[data-qa="mobile_number"]').type(data.mobileNumber)
            cy.get('[data-qa="mobile_number"]').invoke('prop', 'value').should('eq', data.mobileNumber)


            cy.get('[data-qa="create-account"]').click()
            cy.get('[data-qa="account-created"]').should('be.visible').and('contain', 'Account Created!')
            cy.get('[data-qa="continue-button"]').click()
            cy.get('.navbar-nav li').last().should('contain', `Logged in as ${data.username}`)
            cy.contains('Delete Account').click()
            cy.get('[data-qa="account-deleted"]').should('be.visible').and('contain', 'Account Deleted!')
            cy.get('[data-qa="continue-button"]').click()

        })       
    })
})
