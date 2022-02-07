'use strict'

const dynamoDb = require('./dynamoDb')
const {logError} = require('../utils/errorUtils')

/**
 * Class for performing operation on th DynamoDB user table.
 */
class UserEntity {

    /**
     * Constructor for UserEntity class.
     *
     * @param {string} tableName - DynamoDB user table name.
     */
    constructor(tableName) {
        this.tableName = tableName
        Object.freeze(this)
    }

    /**
     * Puts new User object to the user DynamoDB table.
     *
     * @param {User} user - User object.
     * @returns {Promise<DocumentClient.PutItemOutput>}
     */
    put = async (user) => {
        const params = {
            TableName: this.tableName,
            Item: user,
            ConditionExpression: 'attribute_not_exists(username)'
        }

        console.log('Adding User object to DynamoDB...')

        return dynamoDb.put(params)
    }

    /**
     * Updates User object in the user DynamoDB table.
     *
     * @param {User} user - User object.
     * @returns {Promise<DocumentClient.PutItemOutput>}
     */
    update = async (user) => {
        const params = dynamoDb.createUpdateParams(this.tableName, 'username', undefined, user)
        console.log('Updating User object in DynamoDB...')
        return dynamoDb.update(params)
    }

    /**
     * Gets User object from user DynamoDB table with username.
     *
     * @param {string} username
     * @returns {Promise<User|undefined>} - Returns User object or undefined.
     */
    get = async (username) => {
        const params = {
            TableName: this.tableName,
            Key: {
                username
            }
        }

        console.log('Getting User object from DynamoDB...')

        try {
            const result = await dynamoDb.get(params)
            return result.Item
        } catch (error) {
            logError(error)
        }
    }

    /**
     * Gets users role.
     *
     * @param username
     * @returns {Promise<Role|undefined>} Gets users role or undefined if user was not found.
     */
    getRole = async (username) => {
        console.log(`Getting ${username} user's role...`)
        const user = await this.get(username)
        if (user) return user.role
    }

    /**
     * Gets all users.
     *
     * @param {string} username - Username of the user that should be excluded from the result.
     * @param {number} [limit] - Maximum number of items that should be return.
     * @param {string} [exclusiveStartKey] - The exclusive start key from which item should the scan start.
     * @return {Promise<{lastEvaluatedKey: string, items: User[]}>} - Returns array of User objects.
     */
    getOtherUsers = async (username, limit, exclusiveStartKey) => {
        const params = {
            TableName: this.tableName,
            FilterExpression: "username <> :username",
            ExpressionAttributeValues: {
                ":username": username
            },
            ExpressionAttributeNames: {
                "#role": "role"
            },
            ProjectionExpression: "username, #role, firstName, lastName, gender, birthday"
        }

        if (limit) {
            params.Limit = limit
        }

        if (exclusiveStartKey) {
            params.ExclusiveStartKey = {
                username: exclusiveStartKey
            }
        }

        try {
            const result = await dynamoDb.scan(params)
            const lastEvaluatedKey = result.LastEvaluatedKey ? result.LastEvaluatedKey.username : undefined
            return {
                items: result.Items,
                lastEvaluatedKey
            }
        } catch (error) {
            logError(error)
            return []
        }
    }

    /**
     * Deletes User object from the table.
     *
     * @param {string} username
     * @returns {Promise<DocumentClient.DeleteItemOutput>}
     */
    delete = async (username) => {
        console.log(`Deleting ${username} user...`)
        const params = {
            TableName: this.tableName,
            Key: {
                username
            }
        }
        return dynamoDb.deleteItem(params)
    }
}

module.exports = UserEntity