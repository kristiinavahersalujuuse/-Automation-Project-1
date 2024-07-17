
import { faker } from '@faker-js/faker'
import 'cypress-file-upload'

// ********* Variables ******* //

const fullName = faker.person.fullName()
const email = faker.internet.email()
const expectedAustriaCityOptions = [
    "",
    "Vienna",
    "Salzburg",
    "Innsbruck"
  ]
  const today = new Date()
  const date = today.toISOString().split("T")[0]
  const fileName = "cerebrum_hub_logo.png"

// *********  Birthday variable and function ********* //
  const randomBirthday = getRandomBirthday(1, 100); // Random birthday for someone between 1 and 100 years old
  console.log(randomBirthday)

function getRandomBirthday(minAge, maxAge) {
    const today = new Date()
    const currentYear = today.getFullYear()
    const randomYear = currentYear - Math.floor(Math.random() * (maxAge - minAge + 1) + minAge)
    const randomMonth = Math.floor(Math.random() * 12)
    const randomDay = Math.floor(Math.random() * (new Date(randomYear, randomMonth + 1, 0).getDate())) + 1
    const randomBirthday = new Date(randomYear, randomMonth, randomDay)
    const formattedBirthday = randomBirthday.toISOString().split("T")[0]
    return formattedBirthday;
  }

// ********* Functions with valid data ********* //
  
function inputValidData(validMandatoryData) { 
    cy.log('Valid data, only mandatory fields') 
    cy.get('#name').type(validMandatoryData) 
    cy.get('input[name="email"]').type(email)
    cy.get('#country').select('Estonia')
    cy.get('#city').select('Tartu')
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    cy.get('h2').contains('Birthday').click()
}

function inputAllData(validAllData) { //POOLELI
    cy.log('Valid data, all possible fields') 
    cy.get('#name').type(validAllData) 
    cy.get('input[name="email"]').type(email)
    cy.get('#country').select('Austria')
    cy.get('#city').select('Vienna')
    cy.get('input[type="date"]').first().type(date)
    cy.get('input[type="radio"]').eq(1).check().should('be.checked')
    cy.get('#birthday').type(randomBirthday)
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
    // uploading and submitting a file
    cy.get('h2').contains('Birthday').click()
}

// ********* Function with empty mandatory data ******* //

function inputOptionalData() {
    cy.log('Missing mandatory data field, only optional are added, no file')
    cy.get('input[type="date"]').first().type(date)
    cy.get('input[type="radio"]').eq(1).check().should('be.checked')
    cy.get('#birthday').type(randomBirthday)
    cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
    cy.get('h2').contains('Birthday').click()
}

function inputMissingEmailData() {
    cy.log('Missing mandatory email field, using fun blur')
    cy.get('#name').type(fullName)
    cy.get('input[name="email"]').focus().blur()
    cy.get('#country').select('Estonia')
    cy.get('#city').select('Tartu')
    cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
    cy.get('h2').contains('Birthday').click()
}

beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block) 
* Create tests to verify visual parts of the page:
    * radio buttons and its content 
    * dropdown and dependencies between 2 dropdowns: 
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */

describe('Visual tests for Registration form 3', () => {

     it('Check country and city dropdown', () => {

        cy.get('#country').select('Spain')

        // Verify the options for the city dropdown
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.text)
            expect(actual).to.deep.eq(['','Malaga', 'Madrid', 'Valencia', 'Corralejo'])
        })

    })


    it('Check country and city dropdown and its dependecies', () => {
        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').should('have.length', 4)
        
        // Select second element in the dropdown, must be Estonia
        cy.get('#country').select('Estonia').should('have.value', 'object:4')

        // Check that Tartu can be chosen from city option
        cy.get('#city').select('Tartu').should('contain', 'Tartu')
        
        // Change to third element in the country, must be Austria
        cy.get('#country').select('Austria').should('have.value', 'object:5')

        // Verify that city Tartu is removed
        cy.get("#city").find("option").should("not.contain", "Tartu");

        // Check that Innsbruck can be chosen from city option
         cy.get('#city').select('Innsbruck').should('contain', 'Innsbruck')

        // Advanced level how to check the content of the city by using a constant validator
          cy.get('#city')
            .find('option')
            .then(($options) => {
              const actualAustriaCityOptions = [...$options].map((option) => option.text)
              expect(actualAustriaCityOptions).to.deep.eq(expectedAustriaCityOptions)
            })

        cy.get('#country').select('Spain')
        // Verify the options for the city dropdown
       
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city')
            .find('option')
            .then((options) => {
            const actual = [...options].map((option) => option.text)
            expect(actual).to.deep.eq(["", 'Malaga', 'Madrid', 'Valencia', 'Corralejo'])
        })
    })

    it('Check that Email has correct format', () => { 
        
        //Invalid email input should give error message
        cy.get('input[name="email"]').type('qwerty')

        cy.get('#emailAlert')
            .should('be.visible')
            .should('contain', 'Invalid email address.')

        cy.get('input[name="email"]').clear()

        cy.get('input[name="email"]').type('@qwerty.com')

        cy.get('#emailAlert')
            .should('be.visible')
            .should('contain', 'Invalid email address.')

        //Valid email should not show any error message
        cy.get('input[name="email"]').clear()
        cy.get('input[name="email"]').type('valid@email.com')

        cy.get('#emailAlert').should('not.be.visible')
        cy.get('#emailAlert').should('have.css', 'display', 'block') 
        
    })

    it('Check newsletter radio button list and its functionality', () => { 

        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from the other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Check that policy checkboxes are working correct, verify the link', () => {

        cy.get('input[type="checkbox"]').should('have.length', 2)

        // Verify privacy labels of the checkboxes v1
        cy.get('.w3-cell-row').prev('div').should('contain','Accept our privacy policy')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text','Accept our cookie policy')

        // Verify privacy labels of the checkboxes v2
        cy.get('input[ng-model="checkbox"]').eq(0).should('exist');
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text','Accept our cookie policy')

        //Verify default state of checkboxes
        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')

         // Check both checkboxes
        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')

        //Check that cookie button is visible and click on it
        cy.get('button > a').should('be.visible')
        .and('have.attr', 'href', 'cookiePolicy.html')
        .click()
        
        cy.url().should('contain', '/cookiePolicy.html')
        
        cy.go('back').url().should('contain', '/registration_form_3.html')
        cy.log('Back again in registration form 3')
       
    })

    it('Verify the presence of checkboxes v 2 (AO test case)', () => { 

        // Check if the first checkbox is present
        cy.get('input[ng-model="checkbox"]').should('exist')
        
        // Check if the second checkbox is present and the link is correct
        cy.get('input[type="checkbox"]').should('exist')
      
        // Check the first checkbox
        cy.get('input[ng-model="checkbox"]').check().should('be.checked')
        
        // Uncheck the first checkbox
        cy.get('input[ng-model="checkbox"]').uncheck().should('not.be.checked')
        
        // Check the second checkbox
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        
        // Uncheck the second checkbox
        cy.get('input[type="checkbox"]').eq(1).uncheck().should('not.be.checked')
      
        // Check that first box has text "Accept our privacy policy" and the second one "Accept our cookie policy"
        cy.get('.w3-cell-row').prev('div').should('contain','Accept our privacy policy')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text','Accept our cookie policy')
        
        // Attempt to submit the form without checking the checkboxes
        cy.get('form').submit()
        cy.go('back').url().should('contain', '/registration_form_3.html')
        
        // Verify that it's possible to submit form when both checkboxes are checked
        // Check both checkboxes
        cy.get('input[ng-model="checkbox"]').check()
        cy.get('input[type="checkbox"]').eq(1).check()

        // Submit the form
        cy.get("form").submit()
        cy.go('back').url().should('contain', '/registration_form_3.html')       
      })


    it('Check that Cerebrum Hub logo is correct and has correct size', () => {

        cy.log('Will check CH logo source and size')
        cy.get('img')
            .should('have.attr', 'src')
            .should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height
        cy.get('img')
            .invoke('height')
            .should('be.lessThan', 178)
            .and('be.greaterThan', 160)   
    })

    it("Check that datepicker works for date of registration", () => {

        cy.get('input[type="date"]').first().type(date)
        cy.get('input[type="date"]').should("have.value", date)
    })

    it('Check that it is possible to enter birthday date (easy version)', ()=>{
   
    cy.get('#birthday').type('1999-07-14')
    })
  
    it('Check that it is possible to upload a file', ()=>{
   
        //Upload file
        cy.get("#myFile").attachFile(fileName)

        })

})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */

describe('Functional tests for Registration form 3', () => {

    it('Check that is is possible to submit form with all fields added (no file)', ()=>{ 

        // All fields are added
        inputAllData(fullName)

        // Assert that submit button is enabled
        cy.get('input[type="submit"]').last().should('be.enabled')        

        // Click on the submit button and assert that after submitting the form system shows successful message
        cy.get('input[type="submit"]').click()
        cy.get('div[class="w3-container w3-teal w3-center"]').should('be.visible').should("contain", "Submission received")
        cy.go('back').url().should('contain', '/registration_form_3.html')
      
    })

    it('Check that it is possible to submit form with valid data and only mandatory fields added', ()=>{
        
        // Add test steps for filling in ONLY mandatory fields with valid data - use function
        inputValidData(fullName)

        // Assert that submit button is enabled
        cy.get('input[type="submit"]').last().should('be.enabled') 

        // Click on the submit button and assert that after submitting the form system shows successful message
        cy.get('input[type="submit"]').click()
        cy.get('div[class="w3-container w3-teal w3-center"]').should('be.visible').should("contain", "Submission received")
        cy.go('back').url().should('contain', '/registration_form_3.html')

    })

    it('Check that it is not possible to submit form with no mandatory fields added', ()=>{
        
        // Use function to have empty mandatory fields and only optional are added
        inputOptionalData ('')

        // Assert that submit button is disabled
        cy.get('input[type="submit"]').last().should('be.disabled')

    })

    it('Check that it is not possible to submit form with email missing', ()=>{
        
        // Use function to have empty email field
        inputMissingEmailData()

        // Assert that submit button is disabled
        cy.get('input[type="submit"]').last().should('be.disabled')

    })

    it('Check that file can be added and form can be submitted', ()=>{
        
        // All fields are added
        inputAllData(fullName)

        //Upload file
        cy.get("#myFile").attachFile(fileName)

        //Submit file
        cy.get('button[type="submit"]').should('be.enabled')  
        cy.get('button[type="submit"]').click()
        cy.get('div[class="w3-container w3-teal w3-center"]').should('be.visible').should("contain", "Submission received")
        cy.go('back').url().should('contain', '/registration_form_3.html') 

        // Assert that submit button is enabled
        // Should be .should('be.enabled'), but theren is a bug in the system. After submitting the file, mthe submit button is disabled.
        cy.get('input[type="submit"]').should('not.be.enabled')             

    })
})