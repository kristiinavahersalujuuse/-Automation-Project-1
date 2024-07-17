import { faker } from '@faker-js/faker';

// ***** List of variables and functions *****//

const randomEmail = faker.internet.email();
const randomlastName = faker.person.lastName();

let password = 'testpassword123'

function inputValidData(username) {
    cy.log('Username will be filled') 
    cy.get('#username').type(username) 
    cy.get('#email').type(faker.internet.email())
    cy.get('[data-cy="name"]').type('Kristiina')
    cy.get('#lastName').type(faker.person.lastName())
    cy.get('[data-testid="phoneNumberTestId"]').type('555555555')
    cy.get('#password').type(password)
    cy.get('#confirm').type(password)
    cy.get('h2').contains('Password').click()
}

function inputEmptyData(username) {
    cy.log('Missing mandatory data - lastName')
    cy.get('#username').type(username)
    cy.get('#email').type(faker.internet.email())
    cy.get('[data-cy="name"]').type('Kristiina')
    cy.get('#lastName').type(' ')
    cy.get('[data-testid="phoneNumberTestId"]').type('555555555')
    cy.get('#password').type(password)
    cy.get('#confirm').type(password)
    cy.get('h2').contains('Password').click()
}

beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4
*/

describe('Section 1: Functional tests', () => {

    it('User can use only same both first and validation passwords', ()=>{ 

        cy.get('#username').type('Something')
        cy.get('#email').type(faker.internet.email())
        cy.get('input[name="name"]').type('Mariliis')
        cy.get('#lastName').type(faker.person.lastName())
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('input[name="password"]').type(password)
        cy.get('#confirm').type('RandomPass')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#password_error_message').should('be.visible')
        cy.get('#confirm').clear()
        cy.get('#confirm').type(password)
        cy.get('h2').contains('Password').click()
        cy.get('#password_error_message').should('not.be.visible')
        cy.get('.submit_button').should('be.enabled')
    })
    
    it('User can submit form with all fields added', ()=>{ 

        cy.get('#username').type('Something')
        cy.get('#email').type(faker.internet.email())
        cy.get('input[name="name"]').type('Mariliis')
        cy.get('#lastName').type(faker.person.lastName())
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('input[type="radio"]').check('CSS')
        cy.get('input[class="checkbox vehicles"]').check('Boat')
        cy.get('#cars').select('opel')
        cy.get('#animal').select('cow')
        cy.get('input[name="password"]').type(password)
        cy.get('[name="confirm"]').type(password)
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.disabled')
        cy.get(".submit_button").click()
        cy.get("#input_error_message").should("not.be.visible");
        cy.get("#password_error_message").should("have.css", "display", "none")
        cy.get('#success_message').should('be.visible').should("contain", "User successfully submitted registration")
    })

    it('User can submit form with valid data and only mandatory fields added', ()=>{
        
        inputValidData('userKristiina')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').should('not.be.disabled')
        cy.get(".submit_button").click()
        cy.get("#success_message").should("have.css", "display", "block")

    })

    it('User can not submit form when "Last name" mandatory field is not present ver1', ()=>{

        inputEmptyData('Kristiina123')
        cy.get('.submit_button').should('not.be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message')
            .should('be.visible')
            .should('contain', 'Mandatory input field is not valid or empty!')
        cy.get('#lastName')
            .should('have.attr', 'title')
            .should('contain', 'Input field')
        cy.get('#input_error_message').should('have.css', 'display', 'block') 
    })

    it('User can not submit form when "Last name" from mandatory field is not present ver2', ()=>{
        
        inputValidData('Kristiina123')
        cy.get('#lastName').scrollIntoView()
        cy.get('#lastName').clear()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message')
            .should('be.visible')
            .should('contain', 'Mandatory input field is not valid or empty!')
        cy.get('#lastName')
            .should('have.attr', 'title')
            .should('contain', 'Input field')
        cy.get('#input_error_message').should('have.css', 'display', 'block')       
    })
})

/*
Assignement 5: create more visual tests
*/

describe('Section 2: Visual tests', () => {
    
    it('Check that Cerebrum Hub logo is correct and has correct size', () => {

        cy.log('Will check CH logo source and size')
        cy.get('img')
            .should('have.attr', 'src')
            .should('include', 'cerebrum_hub_logo')
        cy.get('img')
            .invoke('height')
            .should('be.lessThan', 178)
            .and('be.greaterThan', 100)   
    })

    it('Check that Cy (Cypress) logo is correct and has correct size', () => {

        cy.log('Will check Cypress logo source and size')
        cy.get('img')
            .eq(1)
            .should('have.attr', 'src')
            .should('include', 'cypress_logo')
        cy.get('img')
            .eq(1)
            .invoke('height')
            .should('be.lessThan', 116)
            .and('be.greaterThan', 85) 
    });

    it('Check navigation to link Registration form 1', () => {

        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        cy.get('nav')
            .children()
            .eq(0)
            .should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        cy.url().should('contain', '/registration_form_1.html')
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    it('Check navigation to link Registration form 3', () => {

        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        cy.get('nav')
            .children()
            .eq(1)
            .should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .click()
        cy.url().should('contain', '/registration_form_3.html')
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    it('Check that radio button list "Web language" is correct', () => { 

        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP')

        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Check that checkbox list "Favourite transport" is correct', () => {

        cy.get('input[type="checkbox"]').should('have.length', 3)

        cy.get('input[type="checkbox"]').next().eq(0).should('have.text','I have a bike')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text','I have a car')
        cy.get('input[type="checkbox"]').next().eq(2).should('have.text','I have a boat')

        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(2).should('not.be.checked')

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(2).check().should('be.checked')
    })
   
    it('Check that car dropdown is correct', () => {

        cy.get('#cars').select(1).screenshot('Cars drop-down')
        cy.screenshot('Full page screenshot')

        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)
        
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })

    it('Check that Animal dropdown is correct', () => { 

        cy.get('#animal').select(3).screenshot('Animals drop-down')
        cy.screenshot('Full page screenshot')

        cy.get('#animal').children().should('have.length', 6)
        
        cy.get('#animal').find('option').eq(0).should('have.text', 'Dog')
        cy.get('#animal').find('option').eq(1).should('have.text', 'Cat')

        cy.get('#animal')
            .find('option')
            .then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq([
                'dog', 
                'cat', 
                'snake', 
                'hippo',
                'cow',
                'mouse'
            ])
        })
    })
})

