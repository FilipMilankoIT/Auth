'use strict'

const {authorizationRegexCheck, getKidFromToken, getUsernameFromToken, verifyToken} = require('../Jwt')
const SecretKeyEntity = require('../../databse/SecretKeyEntity')
const {logError} = require('../../utils/errorUtils')

/**
 * Handler for the Authorizer Lambda that verifies API requests tokens.
 *
 * @param {Object} event - Lambda event.
 * @return {Promise<{policyDocument: {Version: string, Statement: {Action: string, Resource: *, Effect: string}[]}, principalId: *}|*>}
 */
module.exports.handler = async (event) => {
    console.log('Received event:\n', JSON.stringify(event))

    try {
        const token = getTokenFromEvent(event)

        const kid = getKidFromToken(token)
        console.log('Extracted the kid:', kid);

        const secretKeyEntity = new SecretKeyEntity(process.env.secretKeyTable)
        const key = await secretKeyEntity.get(kid)

        if (!key) {
            throw new Error('Couldn\'t find signing key')
        }

        verifyToken(token, key.secretKey)
        console.log('Successfully verified the access token');

        const userId = getUsernameFromToken(token)
        console.log('Extracted username:', userId);

        const policyDocument = buildIAMPolicy(userId, process.env.ApiGatewayArn)

        console.log('Returning IAM policy:\n', JSON.stringify(policyDocument));

        return policyDocument
    } catch (error) {
        logError(error)
        throw 'Unauthorized'
    }
}

/**
 * Extracts JWS token from Authorizer Lambda event.
 *
 * @param {Object} event - Authorizer Lambda event.
 * @return {string} - Returns JWT.
 */
function getTokenFromEvent(event) {
    /**
     * Based on the Regex used inside the jsonwebtoken library. Be sure to update it if the jsonwebtoken updates there's.
     * @type {RegExp}
     */
    if (!event || typeof event.authorizationToken !== 'string') {
        throw new Error('Missing JWT token in Authorization header.')
    }
    if (!authorizationRegexCheck(event.authorizationToken)) {
        throw new Error('Invalid bearer token.')
    }
    return event.authorizationToken.split(' ')[1]
}

/**
 * Build IAM Policy for execute-api:Invoke action.
 *
 * @param {string} userId - User ID.
 * @param {string} resource - AWS resource/s arn/s.
 * @return {{policyDocument: {Version: string, Statement: {Action: string, Resource: *, Effect: string}[]}, principalId: *}}
 */
function buildIAMPolicy(userId, resource) {
    if (!userId) {
        throw new Error('User ID is undefined.')
    }
    if (!resource) {
        throw new Error('Resource is undefined.')
    }
    return {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: resource
                }
            ]
        }
    }
}