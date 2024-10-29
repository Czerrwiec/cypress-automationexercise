/// <reference types = "cypress" />

describe('API tests', () => {


    it('Get All Products List - check status code', () => {

        cy.request("GET", Cypress.env('apiUrl') + '/productsList').should((response) => {
            
            expect(response.status).to.eq(200)
        })
    })


    it.skip('POST To All Products List', () => {
        cy.request("POST", Cypress.env('apiUrl') + '/productsList').should((response) => {

            expect(response.status).to.eq(405)
        })
    })

    it('Get All Brands List', () => {
        cy.request("POST", Cypress.env('apiUrl') + '/brandsList').should((response) => {

            expect(response.status).to.eq(200)
        })
    })
})