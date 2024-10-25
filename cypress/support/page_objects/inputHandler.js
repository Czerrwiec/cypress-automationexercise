export class InputHandler {

    checkLabelVisibilityAndContent({selector, value, index, object}){

            if (selector !== undefined && object === undefined) {
                cy.get(selector).then( item => {

                    if (value === undefined && index === undefined) {
                        cy.wrap(item).should('be.visible').and('contain', item.text())
                    } else if (value === undefined && index !== undefined) {
                        cy.wrap(item).eq(index).then( selector => {
                            cy.wrap(selector).should('be.visible').and('contain', selector.text())
                        })
                    } else if (value !== undefined && index !== undefined) {
                        cy.wrap(item).eq(index).then( selector => {
                            cy.wrap(selector).should('be.visible').and('contain', value)
                        })
                    }      
                })
            } else {
                if (value === undefined && index === undefined) {
                    cy.wrap(object).should('be.visible').and('contain', object.text())
                    
                } else if (value !== undefined && index === undefined) {
                    cy.wrap(object).should('be.visible').and('contain', value)
                    }
            }      
        }   
            
    

    radioButtonChecker(selector) {

        cy.get(selector).then( item => {
            cy.wrap(item)
                .invoke('prop', 'checked')
                .should('eq', false)
            cy.wrap(item)
                .check()
                .invoke('prop', 'checked')
                .should('eq', true)
        } ) 
    }

    inputValueChecker({selector, value, typeContent}) {
        
        if (value !== undefined) {
            cy.get(selector).invoke('prop', 'value').should('eq', value)
        } else {
            cy.get(selector).type(typeContent).invoke('prop', 'value').should('eq',typeContent)
        }       
    }

}

export const inputHandler = new InputHandler()