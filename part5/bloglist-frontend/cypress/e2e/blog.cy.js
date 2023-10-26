describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'tester',
      username: 'testing',
      password: 'testing'
    }
    const user2 = {
      name: 'tester2',
      username: 'testing2',
      password: 'testing2'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input:first').type('testing')
      cy.get('input:last').type('testing')
      cy.contains('login').click()

      cy.contains('tester logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input:first').type('testing')
      cy.get('input:last').type('123131313')
      cy.contains('login').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'tester logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testing', password: 'testing' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('form').should('contain', 'create new')
      cy.get('#title').type('testing123')
      cy.get('#author').type('tester123')
      cy.get('#url').type('www.testing123.com')
      cy.contains('title:').parent().find('button').as('theButton')
      cy.get('@theButton').contains('create').click()
      cy.get('.togglehide').should('contain', 'testing123 tester123')

      cy.get('.message')
        .should('contain', 'a new blog testing123 added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('A blog can be liked', function () {

      cy.createBlog({
        title: 'testing123',
        author: 'tester123',
        url: 'www.testing123.com'
      })

      cy.get('.togglehide')
      cy.get('#viewButton').click()

      cy.contains('like').click()
      cy.get('.toggleshow')
        .should('contain', 'likes 1')
    })


    it('A blog can be liked and already arranged', function () {

      cy.createBlog({
        title: 'The title with the second most likes',
        author: 'tester12345',
        url: 'www.testing12345.com',
      })

      cy.createBlog({
        title: 'The title with the most likes',
        author: 'tester123',
        url: 'www.testing123.com',
      })

      cy.get('.blog').eq(1).contains('view').click()
      cy.get('.toggleshow').eq(1).contains('like').click().click()
      cy.get('.toggleshow').eq(0).should('contain', 'The title with the most likes')

      cy.get('.blog').eq(1).contains('view').click()
      cy.get('.toggleshow').eq(1).should('contain', 'The title with the second most likes')


    })
  })

  describe('A blog can only be removed by the user who created it', function() {
    beforeEach(function(){
      cy.login({ username: 'testing', password: 'testing' })
      cy.createBlog({
        title: 'testing123',
        author: 'tester123',
        url: 'www.testing123.com'
      })
    })
    it('A blog can be removed', function(){
      cy.get('.togglehide')
      cy.get('#viewButton').click()
      cy.get('html')
        .should('contain', 'testing123 tester123')
      cy.contains('remove').click()
      cy.get('html')
        .should('not.contain', 'testing123 tester123')
    })
    it('A blog cannot be removed', function(){
      cy.contains('logout').click()
      cy.login({ username: 'testing2', password: 'testing2' })
      cy.get('.togglehide')
      cy.get('#viewButton').click()
      cy.get('.toggleshow')
        .should('contain', 'testing123 tester123')
        .and('not.contain', 'remove')
    })
  })
})