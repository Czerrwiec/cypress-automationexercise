/// <reference types = "cypress" />

import { inputHandler } from "../support/page_objects/inputHandler"
import { navigate } from "../support/page_objects/navigateTo"
import { selectChecker } from "../support/page_objects/selectChecker"


describe('e2e tests', () => {

    beforeEach('open mainpage', () => {
        cy.visit('/')
    })

	it.only('User registration and then delete account', () => {
        navigate.toSignupUser()

        inputHandler.checkLabelVisibilityAndContent({label:'.signup-form h2'})
        
        cy.readJson('data.json').then((data) => {
            cy.get('.signup-form form').then( form => {
                cy.wrap(form).find('[data-qa="signup-name"]').type(data.name)
                cy.wrap(form).find('[data-qa="signup-email"]').type(data.email)
                cy.wrap(form).find('[data-qa="signup-button"]')
                cy.wrap(form).find('button').click()
            })
        })

        inputHandler.checkLabelVisibilityAndContent({label:'.text-center',index: 0})
        inputHandler.checkLabelVisibilityAndContent({label:'.text-center',index: 1})

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


        //params (select, 'default picked option', value to pick)

        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="days"]','Day','7')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="months"]','Month', 'June')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="years"]', 'Year', '1986')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="country"]', 'India', 'Israel')
  
        // selectChecker.checkSelectAllChoices('[data-qa="days"]', 'option')
        // selectChecker.checkSelectAllChoices('[data-qa="months"]', 'option')
        // selectChecker.checkSelectAllChoices('[data-qa="years"]', 'option')
        // selectChecker.checkSelectAllChoices('[data-qa="country"]', 'option')
    
        cy.readJson('userRegistrationData.json').then((data) => {
           
            inputHandler.checkLabelVisibilityAndContent({label:'[for="first_name"]'})    
            inputHandler.fillAndCheck('[data-qa="first_name"]', data.firstName)

            inputHandler.checkLabelVisibilityAndContent({label:'[for="last_name"]'})    
            inputHandler.fillAndCheck('[data-qa="last_name"]', data.lastName)

            inputHandler.checkLabelVisibilityAndContent({label:'[for="company"]'})    
            inputHandler.fillAndCheck('[data-qa="company"]', data.company)

            inputHandler.checkLabelVisibilityAndContent({label:'[for="address1"]'})    
            inputHandler.fillAndCheck('[data-qa="address"]', data.address)

            inputHandler.checkLabelVisibilityAndContent({label:'[for="address2"]'})    
            inputHandler.fillAndCheck('[data-qa="address2"]', data.address2)

            inputHandler.checkLabelVisibilityAndContent({label:'[for="state"]'})    
            inputHandler.fillAndCheck('[data-qa="state"]', data.state)

            inputHandler.checkLabelVisibilityAndContent({label:'#city'})    
            inputHandler.fillAndCheck('[data-qa="city"]', data.city)

            inputHandler.checkLabelVisibilityAndContent({label:'#zipcode'})    
            inputHandler.fillAndCheck('[data-qa="zipcode"]', data.zipcode)

            inputHandler.checkLabelVisibilityAndContent({label:'[for="mobile_number"]'}) 
            inputHandler.fillAndCheck('[data-qa="mobile_number"]', data.mobileNumber)

            cy.get('[data-qa="create-account"]').click()
            inputHandler.checkLabelVisibilityAndContent({label:'[data-qa="account-created"]'})
            
            cy.get('[data-qa="continue-button"]').click()

            inputHandler.checkLabelVisibilityAndContent({label:'.navbar-nav li', value: `Logged in as ${data.username}`, index: 9})
            cy.contains('Delete Account').click()

            inputHandler.checkLabelVisibilityAndContent({label:'[data-qa="account-deleted"]'})
            cy.get('[data-qa="continue-button"]').click()
        })       
    })


    it('Login/logout user with correct data', () => {
        cy.userLogIn('registratedUser.json')
        cy.contains('Logout').click()
    })


    it('Login user with incorrect data', () => {
        cy.readJson('data.json').then((data) => {
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

        navigate.toProducts()

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
    
        navigate.toProducts()
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

        cy.get('.navbar-nav li').eq(2)
            .find('a')
            .click()
        cy.get('.single-widget h2').should('be.visible').and('contain', 'Subscription')
        cy.get('#susbscribe_email').type('email@email.com')
        cy.get('#subscribe').click()

        cy.get('#success-subscribe .alert-success').should('be.visible').and('contain', 'You have been successfully subscribed!')
    })


    it('Add Products to Cart', () => {
        navigate.toProducts()

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
