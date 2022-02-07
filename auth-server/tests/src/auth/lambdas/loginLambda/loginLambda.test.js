'use strict'

const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const testData = require('./loginLambda.testData.json')
const {handler} = require('../../../../../src/auth/lambdas/loginLambda')
const Jwt = require('../../../../../src/auth/Jwt')


describe('Unit tests for login Lambda function', () => {

    before((done) => {

        process.env.userTable = 'auth-server-dev-user-table'
        process.env.secretKeyTable = 'auth-server-dev-secret-key-table'

        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            if (JSON.stringify(params) === JSON.stringify(testData.getUserParams)) {
                callback(null, testData.getUserResult)
            } else {
                callback('Wrong get params:\n' + JSON.stringify(params))
            }
        })

        AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
            if (JSON.stringify(params) === JSON.stringify(testData.scanKeysParams)) {
                callback(null, testData.scanKeysResult)
            } else {
                callback('Wrong scan params:\n' + JSON.stringify(params))
            }
        })

        done()
    })

    it('Should successfully login user', async () => {
        const response = await handler(testData.loginEvent)
        const testResponse = testData['200Response']

        expect(response.statusCode).to.eql(testResponse.statusCode)
        expect(response.headers).to.eql(testResponse.headers)

        const body = JSON.parse(response.body)
        const kid = Jwt.getKidFromToken(body.token)
        expect(kid).to.eql(testData.correctKid)
    })

    it('Should get 400 response without username', async () => {
        const response = await handler(testData.loginEventWithoutUsername)
        expect(response).to.eql(testData['400ResponseInvalidUsername'])
    })

    it('Should get 400 response without password', async () => {
        const response = await handler(testData.loginEventWithoutPassword)
        expect(response).to.eql(testData['400ResponseInvalidPassword'])
    })

    it('Should get 400 response for already registered username', async () => {
        const response = await handler(testData.loginEventForNotExistingUsername)
        expect(response).to.eql(testData['400ResponseUsernameDoesNotExist'])
    })

    it('Should get 401 response for incorrect password', async () => {
        const response = await handler(testData.loginEventWithIncorrectPassword)
        expect(response).to.eql(testData['401ResponseUnauthorized'])
    })

    after(done => {
        AWSMock.restore()
        done()
    })
})