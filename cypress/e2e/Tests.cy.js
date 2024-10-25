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

            inputHandler.inputValueChecker({selector :'[data-qa="signup-name"]', typeContent:data.name})
            inputHandler.inputValueChecker({selector :'[data-qa="signup-email"]', typeContent:data.email})

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
            const listFromData = Object.values(data)

            cy.get('.form-group input').then( list => {
                const splicedList = list.splice(4, 9);
                
                splicedList.forEach( (item, index) => {
                    const attr = item.attributes['data-qa']
                    const select = `[${attr.name}="${attr.value}"]`

                    inputHandler.checkLabelVisibilityAndContent({selector:select}) 
                    inputHandler.inputValueChecker({selector:select, typeContent:listFromData[index]})
                });

            })

            cy.get('[data-qa="create-account"]').click()
            inputHandler.checkLabelVisibilityAndContent({selector:'[data-qa="account-created"]'})
            
            cy.get('[data-qa="continue-button"]').click()

            inputHandler.checkLabelVisibilityAndContent({selector:'.navbar-nav li', value: `Logged in as ${data.user_name}`, index: 9})
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

        inputHandler.checkLabelVisibilityAndContent({selector:'.contact-form h2'})

        cy.readJson('registratedUser').then(data => {

            inputHandler.inputValueChecker({selector:'[data-qa="name"]', typeContent:data.name}) 
            inputHandler.inputValueChecker({selector:'[data-qa="email"]', typeContent:data.email})
            
            inputHandler.inputValueChecker({selector:'[data-qa="subject"]', typeContent:'This is the subject'})
            inputHandler.inputValueChecker({selector:'[data-qa="message"]', typeContent:'This is a message body'})

            cy.get('[data-qa="submit-button"]').click()

            cy.get('.contact-form .alert-success').should('be.visible').and('contain', 'Success! Your details have been submitted successfully.')
        })
        
    })


    it('Verify All Products and product detail page', () => {

        navigate.toProducts()

        inputHandler.checkLabelVisibilityAndContent({selector: '.features_items h2', value: 'All Products', index: 0})

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
        const itemToSearch = 'jeans'

        navigate.toProducts()

        inputHandler.inputValueChecker({selector: '#search_product', typeContent:itemToSearch})

        cy.get('#submit_search').click()

        cy.get('.productinfo p').each( element => {

            const lowerCaseItem = element[0].innerText.toLowerCase()

            if (lowerCaseItem.includes(itemToSearch)) {
                // customized method below for color the output
                cy.print({ title: 'success', message: 'Card contains searched item!', type: 'success' })
            }
        })
    })


    it('Verify subscription in Cart page', () => {

        cy.get('.navbar-nav li').eq(2)
            .find('a')
            .click()

        inputHandler.checkLabelVisibilityAndContent({selector:'.single-widget h2'})
        inputHandler.inputValueChecker({selector:'#susbscribe_email', typeContent:'email@email.com'})

        cy.get('#subscribe').click()

        inputHandler.checkLabelVisibilityAndContent({selector: '#success-subscribe .alert-success'})
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


    it('Verify Product quantity in Cart', () => {

        const product = '2'
        const quantity = '-3'

        cy.get(`[href="/product_details/${product}"]`).click()
        cy.get('#quantity').clear().type(quantity)
        cy.get('button.cart').click()
        cy.get('.modal-body').find('a').click()


        cy.get('.cart_quantity button').then( button => {
            
            const value = button[0].textContent

            if (value.startsWith('-') === true || value === '0') {
                cy.print({ title: 'error', message: 'Input contains 0 or negative number', type: 'error' })
            } else {
                cy.wrap(button).should('contain', quantity)
            }
        })

    })


    it('Place Order: Register while Checkout', () => {

        const product = '3'
        const quantity = '1'

        cy.get(`[href="/product_details/${product}"]`).click()

        cy.get('.product-information h2').then((el) => cy.wrap(el.text()).as('element'))

        cy.get('#quantity').clear().type(quantity)
        cy.get('button.cart').click()  
        
        cy.contains('Continue Shopping').click()
        cy.get('.navbar-nav [href="/view_cart"]').click()
        cy.url().should('include', '/view_cart')
        cy.contains('Proceed To Checkout').click()
        cy.get('.modal-body a').click()

        cy.readJson('data.json').then((data) => {

            inputHandler.inputValueChecker({selector :'[data-qa="signup-name"]', typeContent:data.name})
            inputHandler.inputValueChecker({selector :'[data-qa="signup-email"]', typeContent:data.email})

            cy.get('[data-qa="signup-button"]').click()
        })

        cy.get('#id_gender1').check()

        cy.readJson('data.json').then((data => {
            
            inputHandler.inputValueChecker({selector:'[data-qa="name"]', value: data.name})
            inputHandler.inputValueChecker({selector:'[data-qa="email"]', value: data.email})
            inputHandler.inputValueChecker({selector:'[data-qa="password"]', typeContent: data.password})

        }))

        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="days"]','Day','7')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="months"]','Month', 'June')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="years"]', 'Year', '1986')
        selectChecker.selectOneChoiceAndVerifyLength('[data-qa="country"]', 'India', 'Israel')

        cy.readJson('userRegistrationData.json').then((data) => {
            const listFromData = Object.values(data)
            
            cy.get('.form-group input').then( list => {
                const splicedList = list.splice(4, 9);
                
                splicedList.forEach( (item, index) => {
                    const attr = item.attributes['data-qa']
                    const select = `[${attr.name}="${attr.value}"]`

                    inputHandler.checkLabelVisibilityAndContent({selector:select}) 
                    inputHandler.inputValueChecker({selector:select, typeContent:listFromData[index]})
                });

            })

            cy.get('[data-qa="create-account"]').click()
            inputHandler.checkLabelVisibilityAndContent({selector:'[data-qa="account-created"]'})
            
            cy.get('[data-qa="continue-button"]').click()

            inputHandler.checkLabelVisibilityAndContent({selector:'.navbar-nav li', value: `Logged in as ${data.user_name}`, index: 9})
        })
        
        cy.get('.navbar-nav [href="/view_cart"]').click()
        cy.contains('Proceed To Checkout').click()

        cy.url().should('include', '/checkout')

        inputHandler.checkLabelVisibilityAndContent({selector:'.page-subheading', index:0})

        cy.get('#address_delivery li').each( el => {
            cy.wrap(el).should('be.visible').and('not.eq', ' ')
        })

        cy.get('.cart_description a').then( item => {
            cy.get('@element').should('contain', item.text())
        })
        
        cy.get('.cart_quantity button').should('contain', quantity)
        cy.get('textarea').type('This is a message')
        cy.contains('Place Order').click()

        inputHandler.inputValueChecker({selector:'[data-qa="name-on-card"]', typeContent:"Tomasz Czerwiec"})
        inputHandler.inputValueChecker({selector:'[data-qa="card-number"]', typeContent:"999999999"}) 
        inputHandler.inputValueChecker({selector:'[data-qa="cvc"]', typeContent:"331"})
        inputHandler.inputValueChecker({selector:'[data-qa="expiry-month"]', typeContent:"02"})
        inputHandler.inputValueChecker({selector:'[data-qa="expiry-year"]', typeContent:"2026"})

        cy.get('[data-qa="pay-button"]').click()

        cy.url().should('include', 'payment_done/1000')

        cy.contains('Delete Account').click()
        
    })
})

