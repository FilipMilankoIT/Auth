'use strict'

const dynamoDb = require('./dynamoDb')
const {logError} = require('../utils/errorUtils')

/**
 * Class for performing operation on th DynamoDB secret key table.
 */
class SecretKeyEntity {

    /**
     * Constructor for SecretKeyEntity class.
     *
     * @param {string} tableName - DynamoDB secret key table name.
     */
    constructor(tableName) {
        this.tableName = tableName
        Object.freeze(this)
    }

    /**
     * Puts new SecretKey object to the secret key DynamoDB table.
     *
     * @param {SecretKeyEntity.SecretKey} secretKey - SecretKey object.
     * @returns {Promise<DocumentClient.PutItemOutput>}
     */
    put = async (secretKey) => {
        const params = {
            TableName: this.tableName,
            Item: secretKey,
            ConditionExpression: 'attribute_not_exists(kid)'
        }

        console.log('Adding SecretKey object to DynamoDB...')

        return dynamoDb.put(params)
    }

    /**
     * Gets SecretKey object from secret key DynamoDB table with kid.
     *
     * @param {string} kid - Key ID.
     * @returns {Promise<SecretKeyEntity.SecretKey|undefined>} - Returns SecretKey object or undefined.
     */
    get = async (kid) => {
        const params = {
            TableName: this.tableName,
            Key: {
                kid
            }
        }

        console.log('Getting SecretKey object from DynamoDB...')

        try {
            const result = await dynamoDb.get(params)
            return result.Item
        } catch (error) {
            logError(error)
            return
        }
    }

    /**
     * Gets latest secret key from DynamoDB table.
     *
     * @returns {Promise<SecretKeyEntity.SecretKey|undefined>}
     */
    getLatestKey = async () => {
        const params = {
            TableName: this.tableName
        }

        console.log('Getting latest keys...')
        const keys = await dynamoDb.scanAll(params)

        if (!Array.isArray(keys) || keys.length === 0) {
            return
        }

        keys.sort((key1, key2) => key2.createdTimestamp - key1.createdTimestamp)
        return keys[0]
    }

    /**
     * Deletes old keys so that only two new keys are present in the table.
     */
    deleteOldKeys = async () => {
        const params = {
            TableName: this.tableName
        }

        console.log('Scanning for old keys...')
        let keys = await dynamoDb.scanAll(params)
        console.log('Scanned keys:\n', JSON.stringify(keys))

        if (keys.length < 3) {
            console.log('There are no old keys for deletion')
        } else {
            keys.sort((key1, key2) => key2.createdTimestamp - key1.createdTimestamp)
            keys = keys.slice(2)
            console.log('Old keys:\n', JSON.stringify(keys))

            for (const key of keys) {
                await this.delete(key.kid)
            }

            console.log('Successfully deleted all old keys')
        }
    }

    /**
     * Deletes SecretKey object from the table.
     *
     * @param {string} kid - Key ID.
     * @returns {Promise<DocumentClient.DeleteItemOutput>}
     */
    delete = async (kid) => {
        console.log(`Deleting ${kid} key...`)
        const params = {
            TableName: this.tableName,
            Key: {
                kid
            }
        }
        return dynamoDb.deleteItem(params)
    }

    /**
     * Data class for SecretKey objects from DynamoDB secret key table.
     */
    static SecretKey = class SecretKey {

        /**
         * Constructor for SecretKey class.
         *
         * @param {string} kid - Key ID.
         * @param {string} secretKey - The secret key.
         */
        constructor(kid, secretKey) {
            this.kid = kid
            this.secretKey = secretKey
            this.createdTimestamp = Date.now()
            Object.freeze(this)
        }
    }
}

module.exports = SecretKeyEntity