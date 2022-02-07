'use strict'

const {expect} = require('chai')
const AWSMock = require('aws-sdk-mock')
const testData = require('./registrationLambda.testData.json')
const {handler} = require('../../../../../src/auth/lambdas/registrationLambda')


describe('Unit tests for registration Lambda function', () => {

    before((done) => {

        process.env.userTable = 'auth-server-dev-user-table'

        AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            if (JSON.stringify(params) === JSON.stringify(testData.getUserParams)) {
                callback(null, testData.getUserResult)
            } else {
                callback('Wrong get params:\n' + JSON.stringify(params))
            }
        })

        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            if (
                params.TableName === testData.putUserParams.TableName &&
                params.Item.username === testData.putUserParams.Item.username &&
                typeof params.Item.hashPassword === 'string' &&
                params.Item.role === testData.putUserParams.Item.role &&
                params.Item.role === testData.putUserParams.Item.role &&
                params.ConditionExpression === testData.putUserParams.ConditionExpression
            ) {
                callback(null, 'Success')
            } else {
                callback('Wrong put params:\n' + JSON.stringify(params))
            }
        })

        done()
    })

    it('Should successfully register user', async () => {
        const response = await handler(testData.registerEvent)
        expect(response).to.eql(testData['201Response'])
    })

    it('Should get 400 response without username', async () => {
        const response = await handler(testData.registerEventWithoutUsername)
        expect(response).to.eql(testData['400ResponseInvalidUsername'])
    })

    it('Should get 400 response without password', async () => {
        const response = await handler(testData.registerEventWithoutPassword)
        expect(response).to.eql(testData['400ResponseInvalidPassword'])
    })

    it('Should get 409 response for already registered username', async () => {
        const response = await handler(testData.registerEventWithExistingUsername)
        expect(response).to.eql(testData['409ResponseAlreadyRegistered'])
    })

    after(done => {
        AWSMock.restore()
        done()
    })
})