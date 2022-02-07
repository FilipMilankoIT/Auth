'use strict'

const GetUsersRequest = require('../../model/api-request/GetUsersRequest')
const GetUsersResponse = require('../../model/api-response/GetUsersResponse')
const UserEntity = require('../../databse/UserEntity')
const Role = require('../../model/Role').Role
const {logError} = require('../../utils/errorUtils')

const ALLOWED_ROLES = new Set([Role.USER_MANAGER, Role.ADMIN])

/**
 * Get users Lambda function handler for responding to GET users API requests.
 *
 * @param {Object} event - Lambda event.
 * @returns {Promise<Response>} - Returns REST API response.
 */
module.exports.handler = async (event) => {
    console.log("Received event:\n", JSON.stringify(event))

    let request

    try {
        request = new GetUsersRequest(event)
        console.log("Received request:\n", JSON.stringify(request))

        request.verify()
    } catch (error) {
        logError(error)
        return GetUsersResponse.badRequestResponse(Response.ErrorCode.INVALID_BODY, error.message)
    }

    if (!await hasPermission(request)) {
        return GetUsersResponse.forbiddenResponse()
    }

    try {
        const userEntity = new UserEntity(process.env.userTable)
        const result = await userEntity.getOtherUsers(request.senderUsername, request.limit, request.exclusiveStartKey)

        console.log('Successfully retrieved all users:\n', JSON.stringify(result))

        return GetUsersResponse.okResponse(result.items, result.lastEvaluatedKey)
    } catch (error) {
        logError(error)
        return GetUsersResponse.internalErrorResponse()
    }
}

/**
 *  Checks if the requester has permission for this request.
 *
 * @param {GetUsersRequest} request - GetUsersRequest object.
 * @returns {Promise<boolean>} - Returns Promise with true if the requester has permission and false otherwise.
 */
async function hasPermission(request) {
    const userEntity = new UserEntity(process.env.userTable)
    const role = await userEntity.getRole(request.senderUsername)
    return ALLOWED_ROLES.has(role)
}