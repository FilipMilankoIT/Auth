'use strict'

const AWS = require('aws-sdk')

/**
 * Performs get operation on DynamoDB.
 *
 * @param {DocumentClient.GetItemInput} params - Get parameters.
 * @return {Promise<DocumentClient.GetItemOutput>}
 */
function get(params) {
    console.log('Performing DynamoDB get operation:\n', JSON.stringify(params))
    const docClient = new AWS.DynamoDB.DocumentClient()
    return docClient.get(params).promise()
}

/**
 * Performs query operation on DynamoDB.
 *
 * @param {DocumentClient.QueryInput} params - Query parameters.
 * @return {Promise<Array>} - Returns Promise with array of items from the table.
 */
function query(params) {
    console.log("Performing DynamoDB query operation:\n", JSON.stringify(params))

    let queryResult = []
    const docClient = new AWS.DynamoDB.DocumentClient()

    return new Promise((resolve, reject) => {
        docClient.query(params, onQuery)

        function onQuery(error, data) {
            if (error) {
                reject(error)
            } else {
                queryResult = queryResult.concat(data.Items)

                if (data.LastEvaluatedKey !== undefined) {
                    console.log("Query for more...")
                    params.ExclusiveStartKey = data.LastEvaluatedKey
                    docClient.query(params, onQuery)
                } else {
                    resolve(queryResult)
                }
            }
        }
    })
}

/**
 * Performs scan operation on DynamoDB.
 *
 * @param {DocumentClient.ScanInput} params - Scan parameters.
 * @return {PromiseResult<DocumentClient.ScanOutput, AWSError>} - Returns Promise with array of items from the table.
 */
function scan(params) {
    console.log('Performing DynamoDB scan operation:\n', JSON.stringify(params))
    const docClient = new AWS.DynamoDB.DocumentClient()
    return docClient.scan(params).promise()
}

/**
 * Performs scan operation on DynamoDB for all items.
 *
 * @param {DocumentClient.ScanInput} params - Scan parameters.
 * @return {Promise<Array>} - Returns Promise with array of items from the table.
 */
function scanAll(params) {
    console.log('Performing DynamoDB scan operation:\n', JSON.stringify(params))

    let scanResult = []
    const docClient = new AWS.DynamoDB.DocumentClient()

    return new Promise((resolve, reject) => {
        docClient.scan(params, onScan)

        function onScan(error, data) {
            if (error) {
                reject(error)
            } else {
                scanResult = scanResult.concat(data.Items)

                if (data.LastEvaluatedKey !== undefined) {
                    console.log('Query for more...')
                    params.ExclusiveStartKey = data.LastEvaluatedKey
                    docClient.scan(params, onScan)
                } else {
                    resolve(scanResult)
                }
            }
        }
    })
}

/**
 * Runs put operation to DynamoDB.
 *
 * @param {DocumentClient.PutItemInput} params - Put params.
 * @return {Promise<DocumentClient.PutItemOutput>}
 */
function put(params) {
    console.log('Running put operation to DynamoDB:\n', JSON.stringify(params))
    const docClient = new AWS.DynamoDB.DocumentClient()
    return docClient.put(params).promise()
}

/**
 * Creates update params.
 *
 * @param {string} tableName - Table name.
 * @param {string} hashKeyName - Hash key name.
 * @param {string} [sortKeyName] - Sort key name.
 * @param {Object} object - Object with fields that we want to update.
 * @returns {DocumentClient.UpdateItemInput}
 */
function createUpdateParams(tableName, hashKeyName, sortKeyName, object) {
    const params = {
        TableName: tableName,
        Key: {
            [hashKeyName]: object[hashKeyName]
        },
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {},
        ReturnValues: 'ALL_NEW'
    }

    if (sortKeyName) {
        params.Key[sortKeyName] = object[sortKeyName]
    }

    for(const [key, value] of Object.entries(object)) {
        if (key === hashKeyName || key === sortKeyName || value === undefined) continue
        if (params.UpdateExpression) {
            params.UpdateExpression += `, #${key} = :${key}`
        } else {
            params.UpdateExpression = `set #${key} = :${key}`
        }
        params.ExpressionAttributeNames[`#${key}`] = key
        params.ExpressionAttributeValues[`:${key}`] = value
    }

    return params
}

/**
 * Runs update operation to DynamoDB.
 *
 * @param {DocumentClient.UpdateItemInput} params - Update params.
 * @return {Promise<DocumentClient.UpdateItemOutput>}
 */
function update(params) {
    console.log('Running update operation to DynamoDB:\n', JSON.stringify(params))
    const docClient = new AWS.DynamoDB.DocumentClient()
    return docClient.update(params).promise()
}

/**
 * Deletes a single item in a DynamoDB table.
 *
 * @param {DocumentClient.DeleteItemInput} params - Delete params.
 * @returns {Promise<DocumentClient.DeleteItemOutput>}
 */
function deleteItem(params) {
    console.log('Running delete item operation in DynamoDB:\n', JSON.stringify(params))
    const docClient = new AWS.DynamoDB.DocumentClient()
    return docClient.delete(params).promise()
}

module.exports = {
    get,
    query,
    scan,
    scanAll,
    put,
    createUpdateParams,
    update,
    deleteItem
}