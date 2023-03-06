context('Basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('basic nav', () => {
    cy.url()
      .should('eq', 'http://localhost:3333/')

    // cy.contains('[Home Layout]')
    //   .should('exist')

    // cy.get('#input')
    //   .type('Vitesse{Enter}')
    //   .url()
    //   .should('eq', 'http://localhost:3333/hi/Vitesse')

    // cy.contains('[Default Layout]')
    //   .should('exist')

    // cy.get('[btn]')
    //   .click()
    //   .url()
    //   .should('eq', 'http://localhost:3333/')
  })

  it('help & markdown', () => {
    cy.get('[href="/help"]')
      .click()
      .url()
      .should('eq', 'http://localhost:3333/help')

    cy.get('.shiki')
      .should('exist')

    cy.get('[href="/"]')
      .click()
      .url()
      .should('match', /^http:\/\/localhost:3333\/?$/)
  })
})
