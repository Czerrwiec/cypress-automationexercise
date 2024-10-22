/// <reference types = "cypress" />

import { inputHandler } from "../support/page_objects/inputHandler"
import { navigate } from "../support/page_objects/navigateTo"
import { selectChecker } from "../support/page_objects/selectChecker"


describe('e2e tests', () => {

    beforeEach('open mainpage', () => {
        cy.visit('/')
    })

	it('User registration and then delete account', () => {
        navigate.toSignupUser()

        inputHandler.checkLabelVisibilityAndContent({selector:'.signup-form h2'})
        
        cy.readJson('data.json').then((data) => {

            inputHandler.inputValueChecker({selector : '[data-qa="signup-name"]', typeContent: data.name})
            inputHandler.inputValueChecker({selector : '[data-qa="signup-email"]', typeContent: data.email})

            cy.get('[data-qa="signup-button"]').click()
        })

        inputHandler.checkLabelVisibilityAndContent({selector:'.text-center',index: 0})
        inputHandler.checkLabelVisibilityAndContent({selector:'.text-center',index: 1})

        inputHandler.radioButtonChecker('#id_gender2')
        inputHandler.radioButtonChecker('#id_gender1')

        cy.readJson('data.json').then((data => {
            
            inputHandler.inputValueChecker({selector:'[data-qa="name"]', value: data.name})

            inputHandler.inputValueChecker({selector:'[data-qa="email"]', value: data.email})

            inputHandler.inputValueChecker({selector:'[data-qa="password"]', typeContent: data.password})

        }))

        //params (select, 'default picked option', value to pick)

        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="days"]','Day','7')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="months"]','Month', 'June')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="years"]', 'Year', '1986')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="country"]', 'India', 'Israel')
  
        selectChecker.checkSelectAllChoices('[data-qa="days"]', 'option')
        selectChecker.checkSelectAllChoices('[data-qa="months"]', 'option')
        selectChecker.checkSelectAllChoices('[data-qa="years"]', 'option')
        selectChecker.checkSelectAllChoices('[data-qa="country"]', 'option')
    
        cy.readJson('userRegistrationData.json').then((data) => {
           
            inputHandler.checkLabelVisibilityAndContent({selector:'[for="first_name"]'})    
            inputHandler.inputValueChecker({selector:'[data-qa="first_name"]', typeContent: data.firstName})

            inputHandler.checkLabelVisibilityAndContent({selector:'[for="last_name"]'})    
            inputHandler.inputValueChecker({selector:'[data-qa="last_name"]', typeContent: data.lastName})


            inputHandler.checkLabelVisibilityAndContent({selector:'[for="company"]'})    
            inputHandler.inputValueChecker({selector:'[data-qa="company"]', typeContent: data.company})


            inputHandler.checkLabelVisibilityAndContent({selector:'[for="address1"]'})    
            inputHandler.inputValueChecker({selector:'[data-qa="address"]', typeContent: data.address})


            inputHandler.checkLabelVisibilityAndContent({selector:'[for="address2"]'})    
            inputHandler.inputValueChecker({selector:'[data-qa="address2"]', typeContent: data.address2})


            inputHandler.checkLabelVisibilityAndContent({selector:'[for="state"]'})    
            inputHandler.inputValueChecker({selector:'[data-qa="state"]', typeContent: data.state})


            inputHandler.checkLabelVisibilityAndContent({selector:'#city'})    
            inputHandler.inputValueChecker({selector:'[data-qa="city"]', typeContent: data.city})


            inputHandler.checkLabelVisibilityAndContent({selector:'#zipcode'})    
            inputHandler.inputValueChecker({selector:'[data-qa="zipcode"]', typeContent: data.zipcode})


            inputHandler.checkLabelVisibilityAndContent({selector:'[for="mobile_number"]'}) 
            inputHandler.inputValueChecker({selector:'[data-qa="mobile_number"]', typeContent: data.mobileNumber})


            cy.get('[data-qa="create-account"]').click()
            inputHandler.checkLabelVisibilityAndContent({selector:'[data-qa="account-created"]'})
            
            cy.get('[data-qa="continue-button"]').click()

            inputHandler.checkLabelVisibilityAndContent({selector:'.navbar-nav li', value: `Logged in as ${data.username}`, index: 9})
            cy.contains('Delete Account').click()

            inputHandler.checkLabelVisibilityAndContent({selector:'[data-qa="account-deleted"]'})
            cy.get('[data-qa="continue-button"]').click()
        })       
    })


    it('Login/logout user with correct data', () => {
        cy.userLogIn('registratedUser.json')
        cy.contains('Logout').click()
    })


    it('Login user with incorrect data', () => {
        cy.readJson('data.json').then((data) => {
            navigate.toSignupUser()

            inputHandler.checkLabelVisibilityAndContent({selector: '.login-form h2'})

            inputHandler.inputValueChecker({selector: '[data-qa="login-email"]', typeContent:data.email})

            inputHandler.inputValueChecker({selector:'[data-qa="login-password"]', typeContent:data.password + '!'})

            cy.get('[data-qa="login-button"]').click()

            inputHandler.checkLabelVisibilityAndContent({selector: 'p[style="color: red;"]'})

            cy.get('p[style="color: red;"]')
                .should('have.attr', 'style')
                .and('contain', 'color: red;')
        })
    })


    it('Register User with existing email', () => {

        cy.readJson('registratedUser.json').then((data) => {
            navigate.toSignupUser()

            inputHandler.inputValueChecker({selector:'[data-qa="signup-name"]', typeContent:data.name})
            inputHandler.inputValueChecker({selector:'[data-qa="signup-email"]', typeContent:data.email})

            cy.get('[data-qa="signup-button"]').click()

            inputHandler.checkLabelVisibilityAndContent({selector:'p[style="color: red;"]'})

            cy.get('p[style="color: red;"]')
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
