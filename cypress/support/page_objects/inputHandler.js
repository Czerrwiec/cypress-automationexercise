export class InputHandler {

    fillAndCheck(input, value) {
        cy.get(input).type(value)
        cy.get(input).invoke('prop', 'value').should('eq', value)
    }

    // checkLabelVisibilityAndContent(label, value='', index='') {
    checkLabelVisibilityAndContent({label, value, index}){

            console.log(label);
            console.log(value);
            console.log(index);

            cy.get(label).then( item => {

                if (value === undefined && index === undefined) {
                    cy.wrap(item).should('be.visible').and('contain', item.text())
                } else if (value === undefined && index !== undefined) {
                    cy.wrap(item).eq(index).then( label => {
                        cy.wrap(label).should('be.visible').and('contain', label.text())
                    })
                } else if (value !== undefined && index !== undefined) {
                    cy.wrap(item).eq(index).then( label => {
                        cy.wrap(label).should('be.visible').and('contain', value)
                    })
                }       
            })      
    }
}

export const inputHandler = new InputHandler()