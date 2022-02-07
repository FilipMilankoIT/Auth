'use strict'

const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const testData = require('./deleteUserLambda.testData.json')
const {handler} = require('../../../../../src/user-api/lambdas/deleteUserLambda')


describe('Unit tests for deleteUser Lambda function', () => {

    before((done) => {

        process.env.userTable = 'auth-server-dev-user-table'

        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            if (JSON.stringify(params) === JSON.stringify(testData.getUserParams)) {
                callback(null, testData.getUserResult)
            } else {
                callback('Wrong get params:\n' + JSON.stringify(params))
            }
        })

        AWSMock.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
            callback(null, 'Success')
        })

        done()
    })

    it('Should successfully delete user', async () => {
        const response = await handler(testData.deleteUserEvent)
        expect(response).to.eql(testData['200Response'])
    })

    it('Should get 404 response for not found user', async () => {
        const response = await handler(testData.deleteUserEventWithNotFoundUsername)
        expect(response).to.eql(testData['404Response'])
    })

    after(done => {
        AWSMock.restore()
        done()
    })
})