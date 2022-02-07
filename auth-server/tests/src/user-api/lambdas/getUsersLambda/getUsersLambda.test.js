'use strict'

const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const testData = require('./getUsersLambda.testData.json')
const {handler} = require('../../../../../src/user-api/lambdas/getUsersLambda')


describe('Unit tests for getUsers Lambda function', () => {

    before((done) => {

        process.env.userTable = 'auth-server-dev-user-table'

        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            switch (JSON.stringify(params)) {
                case JSON.stringify(testData.getUserParams1):
                    callback(null, testData.getUserResult1)
                    break
                case JSON.stringify(testData.getUserParams2):
                    callback(null, testData.getUserResult2)
                    break
                case JSON.stringify(testData.getUserParams3):
                    callback(null, testData.getUserResult3)
                    break
                default:
                    callback('Wrong get params:\n' + JSON.stringify(params))
            }
        })

        AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
            switch (JSON.stringify(params)) {
                case JSON.stringify(testData.scanParams1):
                case JSON.stringify(testData.scanParams2):
                case JSON.stringify(testData.scanParams3):
                    callback(null, testData.scanResult)
                    break
                default:
                    callback('Wrong scan params:\n' + JSON.stringify(params))
            }
        })

        done()
    })

    it('Should get all users as user manager', async () => {
        const response = await handler(testData.getUsersEventAsUserManager)
        expect(response).to.eql(testData['200Response'])
    })

    it('Should get all users as admin', async () => {
        const response = await handler(testData.getUsersEventAsAdmin)
        expect(response).to.eql(testData['200Response'])
    })

    it('Should get 403 response as user', async () => {
        const response = await handler(testData.getUsersEventAsUser)
        expect(response).to.eql(testData['403Response'])
    })

    after(done => {
        AWSMock.restore()
        done()
    })
})