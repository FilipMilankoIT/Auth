'use strict'

const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const testData = require('./updateUserLambda.testData.json')
const {handler} = require('../../../../../src/user-api/lambdas/updateUserLambda')


describe('Unit tests for updateUser Lambda function', () => {

    before((done) => {

        process.env.userTable = 'auth-server-dev-user-table'

        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            if (JSON.stringify(params) === JSON.stringify(testData.getUserParams)) {
                callback(null, testData.getUserResult)
            } else {
                callback('Wrong get params:\n' + JSON.stringify(params))
            }
        })

        AWSMock.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
            callback(null, testData.updateDynamoDbResponse)
        })

        done()
    })

    it('Should successfully update user', async () => {
        const response = await handler(testData.updateUserEvent)
        expect(response).to.eql(testData['200Response'])
    })

    it('Should get 404 response for not found username', async () => {
        const response = await handler(testData.updateUserEventWithNotFoundUsername)
        expect(response).to.eql(testData['404Response'])
    })

    after(done => {
        AWSMock.restore()
        done()
    })
})