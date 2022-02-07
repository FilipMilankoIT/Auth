'use strict'

const DeleteUserRequest = require('../../model/api-request/DeleteUserRequest')
const DeleteUserResponse = require('../../model/api-response/DeleteUserResponse')
const UserEntity = require('../../databse/UserEntity')
const Role = require('../../model/Role').Role
const {getRoleRank} = require('../../model/Role')
const {logError} = require('../../utils/errorUtils')

const ALLOWED_ROLES = new Set([Role.USER_MANAGER, Role.ADMIN])

/**
 * Delete user Lambda function handler for responding to DELETE users/{username} API requests.
 *
 * @param {Object} event - Lambda event.
 * @returns {Promise<Response>} - Returns REST API response.
 */
module.exports.handler = async (event) => {
    console.log("Received event:\n", JSON.stringify(event))

    let request

    try {
        request = new DeleteUserRequest(event)
        console.log("Received request:\n", JSON.stringify(request))

        request.verify()
    } catch (error) {
        logError(error)
        return DeleteUserResponse.badRequestResponse(Response.ErrorCode.INVALID_BODY, error.message)
    }

    try {
        const userEntity = new UserEntity(process.env.userTable)

        const role = await userEntity.getRole(request.senderUsername)

        if (!await hasPermission(request, role)) {
            return DeleteUserResponse.forbiddenResponse()
        }

        const user = await userEntity.get(request.username)

        if (!user) {
            console.error(`Username ${request.username} not found`)
            return DeleteUserResponse.notFoundResponse(request.username)
        }

        if (getRoleRank(role) < getRoleRank(user.role)) {
            console.error('Can\'t delete user with higher role')
            return DeleteUserResponse.deleteHigherRoleUserResponse()
        }

        await userEntity.delete(request.username)

        console.log(`Successfully deleted ${request.username} user`)

        return DeleteUserResponse.okResponse(request.username)
    } catch (error) {
        logError(error)
        return DeleteUserResponse.internalErrorResponse()
    }
}

/**
 *  Checks if the requester has permission for this request.
 *
 * @param {DeleteUserRequest} request - DeleteUserRequest object.
 * @param {Role} role - Requesters role.
 * @returns {Promise<boolean>} - Returns Promise with true if the requester has permission and false otherwise.
 */
async function hasPermission(request, role) {
    if (request.username === request.senderUsername) return true
    return ALLOWED_ROLES.has(role)
}