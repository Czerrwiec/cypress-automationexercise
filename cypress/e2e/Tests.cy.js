/// <reference types = "cypress" />

describe('e2e tests', () => {

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


	it('User registration and then delete account', () => {
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


    it('Login/logout user with correct data', () => {
        cy.userLogIn('registratedUser.json')
        cy.contains('Logout').click()
    })


    it('Login user with incorrect data', () => {
        cy.readJson('data.json').then((data) => {
            cy.visit('/');
            cy.contains('Signup / Login').click()
            cy.get('.login-form h2').should('be.visible').and('contain','Login to your account')
            cy.get('[data-qa="login-email"]').type(data.email)
            cy.get('[data-qa="login-password"]').type(data.password + '!')
            cy.get('[data-qa="login-button"]').click()

            cy.get('[action="/login"]').find('p')
                .should('be.visible')
                .and('contain', 'Your email or password is incorrect!')

            cy.get('[action="/login"]').find('p')
                .should('have.attr', 'style')
                .and('contain', 'color: red;')
        })
        
    })


    it('Register User with existing email', () => {

        cy.readJson('registratedUser.json').then((data) => {
            cy.visit('/');
            cy.contains('Signup / Login').click()
            cy.get('[data-qa="signup-name"]').type(data.name)
            cy.get('[data-qa="signup-email"]').type(data.email)
            cy.get('[data-qa="signup-button"]').click()

            cy.get('[action="/signup"]').find('p')
                .should('be.visible')
                .and('contain','Email Address already exist!')
            cy.get('[action="/signup"]').find('p')
                .should('have.attr', 'style')
                .and('contain', 'color: red;')
        })
    })


    it('Contact Us Form', () => {
        cy.visit('/')
        cy.contains('Contact us').click()
        cy.get('.contact-form h2').should('be.visible').and('contain', 'Get In Touch')

        cy.readJson('registratedUser').then(data => {

            cy.get('[data-qa="name"]').type(data.name)
            cy.get('[data-qa="email"]').type(data.email)
            cy.get('[data-qa="subject"]').type('This is the subject')
            cy.get('[data-qa="message"]').type('This is a message body')
            cy.get('[data-qa="submit-button"]').click()
            cy.get('.contact-form .alert-success').should('be.visible').and('contain', 'Success! Your details have been submitted successfully.')
        })
        
    })


    it('Verify All Products and product detail page', () => {

        cy.visit('/')
        cy.contains('Products').click()
        cy.get('.features_items h2').should('contain', 'All Products')
        cy.get('.choose').first().find('a').click()

        //details page
        cy.get('.product-information').children().should('be.visible')
        cy.get('.product-information').children().each( item => {

            if (item[0].tagName != 'IMG' && item[0].tagName != 'SPAN') {
                cy.wrap(item).invoke('prop', 'innerText').should('eq', item[0].innerText)
            }
        })

    })


    it('Search for products', () => {

        const item = 'jeans'
        
        cy.visit('/')
        cy.contains('Products').click()
        cy.get('#search_product').type(item)
        cy.get('#submit_search').click()

        cy.get('.productinfo p').each( element => {

            const lowerCaseItem = element[0].innerText.toLowerCase()

            if (lowerCaseItem.includes('jeans')) {
                // customized method below for color the output
                cy.print({ title: 'success', message: 'Card contains searched item!', type: 'success' })
            }
        })
    })


    it('Verify subscription in Cart page', () => {
        cy.visit('/')
        cy.get('.navbar-nav li').eq(2)
            .find('a')
            .click()
        cy.get('.single-widget h2').should('be.visible').and('contain', 'Subscription')
        cy.get('#susbscribe_email').type('email@email.com')
        cy.get('#subscribe').click()

        cy.get('#success-subscribe .alert-success').should('be.visible').and('contain', 'You have been successfully subscribed!')
    })

    it.only('Add Products to Cart', () => {
        cy.navigateToProducts()

        cy.get('.product-overlay').first().find('a').click({ force: true })
        cy.contains('Continue Shopping').click()
        cy.get('.product-overlay').eq(1).find('a').click({ force: true })
        cy.contains('Continue Shopping').click()
        
        //verify cart items
        cy.contains('Cart').click()
        
        cy.get('tbody tr').should('have.length', '2')

        cy.get('tbody tr').first().then( item => {
            cy.wrap(item).find('.cart_price').should('contain', 'Rs. 500')
            cy.wrap(item).find('.cart_quantity button').should('contain', '1')
            cy.wrap(item).find('.cart_total p').should('contain', 'Rs. 500')
            
            cy.wrap(item).find('.cart_quantity_delete').click()
        })

        cy.get('tbody tr').should('have.length', '1')

    })
})
