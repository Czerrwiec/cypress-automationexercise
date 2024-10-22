export class Navigation {


    toProducts() {   
        cy.contains('Products').click()   
    }

    toSignupUser() {
        cy.contains('Signup / Login').click()
    }


}

export const navigate = new Navigation()