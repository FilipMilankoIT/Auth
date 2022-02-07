'use strict'

const {expect} = require('chai')
const testData = require('./verifyFields.testData.json')
const RegisterRequest = require('../../../../../../src/model/api-request/RegistrationRequest')


describe('Unit tests for verifyFields function in RegisterRequest class', () => {

    it('Should not throw error for valid request', async () => {
        const request = new RegisterRequest(testData.registerEvent)
        request.verifyFields()
    })

    it('Should throw error empty string username', async () => {
        const request = new RegisterRequest(testData.registerEventWithEmptyStringUsername)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidUsername)
        }
    })

    it('Should get 400 response for username as number', async () => {
        const request = new RegisterRequest(testData.registerEventWithNumberUsername)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidUsername)
        }
    })

    it('Should get 400 response for null username', async () => {
        const request = new RegisterRequest(testData.registerEventWithNullUsername)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidUsername)
        }
    })

    it('Should get 400 response without username', async () => {
        const request = new RegisterRequest(testData.registerEventWithoutUsername)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidUsername)
        }
    })

    it('Should get 400 response for empty string password', async () => {
        const request = new RegisterRequest(testData.registerEventWithEmptyStringPassword)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })

    it('Should get 400 response for password as number', async () => {
        const request = new RegisterRequest(testData.registerEventWithNumberPassword)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })

    it('Should get 400 response for null password', async () => {
        const request = new RegisterRequest(testData.registerEventWithNullPassword)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })

    it('Should get 400 response without password', async () => {
        const request = new RegisterRequest(testData.registerEventWithoutPassword)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })

    it('Should get 400 response with short password', async () => {
        const request = new RegisterRequest(testData.registerEventWithShortPassword)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })

    it('Should get 400 response with password without uppercase letter', async () => {
        const request = new RegisterRequest(testData.registerEventWithPasswordWithoutUppercaseLetter)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })

    it('Should get 400 response with password without lowercase letter', async () => {
        const request = new RegisterRequest(testData.registerEventWithPasswordWithoutLowercaseLetter)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })

    it('Should get 400 response with password without numbers', async () => {
        const request = new RegisterRequest(testData.registerEventWithPasswordWithoutNumbers)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })

    it('Should get 400 response with password without special character', async () => {
        const request = new RegisterRequest(testData.registerEventWithPasswordWithoutSpecialCharacter)
        try {
            request.verifyFields()
            expect.fail('Test should throw an error')
        } catch (error) {
            expect(error.message).to.eql(testData.errorInvalidPassword)
        }
    })
})