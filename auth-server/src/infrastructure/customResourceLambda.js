'use strict'

const axios = require('axios')
const SecretKeyEntity = require('../databse/SecretKeyEntity')
const {v4: uuidv4} = require('uuid')
const {logError} = require('../utils/errorUtils')

/**
 * Handler for a Lambda function that handles different custom resources create, update and delete events.
 *
 * @param {Object} event - Lambda event object.
 * @param {Object} context - Lambda context object.
 * @namespace event.RequestType
 */
module.exports.handler = async (event, context) => {
    console.log('Received event:\n', JSON.stringify(event))

    const config = event.ResourceProperties

    console.log('Request type:', (event.RequestType))

    let data;

    try {
        if (event.RequestType === 'Create') {

            switch (config.Resource) {
                case 'GenerateJwtKey':
                    await generateJwtKey()
                    break
                default:
                    console.log(`${config.Resource} : not defined as a custom resource, sending success response`)
            }
        } else if (event.RequestType === 'Update') {
            console.log(`${config.Resource} update not supported, sending success response`)
        } else if (event.RequestType === 'Delete') {
            console.log(`${event.LogicalResourceId} : delete not required, sending success response`)
        }

        data = await sendResponse(event, context, 'SUCCESS', data, event.PhysicalResourceId)

        console.log('Successfully send response to custom resource:', data)

        return {result: 'SUCCESS'}
    } catch (error) {
        logError(error)
        try {
            await sendResponse(event, context, 'FAILED', undefined, event.PhysicalResourceId)
        } catch (error) {
            logError(error)
            throw error
        }
        throw error
    }
}

/**
 * Generates a JWT key and stores it in DynamoDB table.
 */
async function generateJwtKey() {
    console.log('Generating new secret key...')
    const secretKeyEntity = new SecretKeyEntity(process.env.secretKeyTable)
    const newKey = new SecretKeyEntity.SecretKey(uuidv4(), uuidv4())
    await secretKeyEntity.put(newKey)
    console.log('Successfully added a new secret key')
}

/**
 * Sends the response to the custom resource that invoke the Lambda.
 *
 * @param {Object} event - Lambda event.
 * @namespace event.ResponseURL
 * @param {Object} context - Lambda context.
 * @param {('SUCCESS', 'FAILED')} responseStatus - Response status.
 * @param {Object} [responseData] - Response data.
 * @param {string} [physicalResourceId] - Physical resource ID.
 * @return {Promise} - Returns Promise with the results of sending the response to custom resources.
 */
function sendResponse(event, context, responseStatus, responseData, physicalResourceId) {
    const responseBody = JSON.stringify({
        Status: responseStatus,
        Reason: 'See the details in CloudWatch Log Stream: ' + context.logStreamName,
        PhysicalResourceId: physicalResourceId || context.logStreamName,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: responseData || {}
    })
    const params = {
        url: event.ResponseURL,
        port: 443,
        method: 'put',
        headers: {
            'Content-Type': '',
            'Content-Length': responseBody.length
        },
        data: responseBody
    }
    console.log('Sending response to custom resource:\n', JSON.stringify(params))
    return axios(params)
}