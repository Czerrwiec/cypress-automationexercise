export class SelectChecker {
    
    checkSelectAllChoices(select, options) {
        cy.get(`${select} ${options}`).then( optionList => {
   
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


    selectOneChoiceAndVerifyLength(select, firstOption, choice) {

        let index

        cy.get(select).then( item => {
            cy.wrap(item).find('option').then( list => {  
                const optionsArray = list.toArray()
                    
                optionsArray.forEach(element => {
                    if (element.innerText == choice) {
                            index = element.index
                    }
                });
            })
        })

        cy.get(select).then( item => {      
            cy.wrap(item).find('option').first()
                .should('contain', firstOption)
                .invoke('prop', 'selected')
                .should('eq', true)
                    
            cy.wrap(item).select(choice).should('contain', choice)
            cy.wrap(item).find('option').eq(index).invoke('prop', 'selected').should('eq', true)
            cy.wrap(item).children().should('have.length', item[0].length)

        })
    } 

}

export const selectChecker = new SelectChecker()