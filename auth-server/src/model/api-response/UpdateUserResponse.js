'use strict'

const Response = require('./Response')

/**
 * UpdateUserResponse class used for creating REST responses for PATCH users/{username} API.
 */
class UpdateUserResponse extends Response {

    /** @inheritDoc **/
    constructor(statusCode, body) {
        super(statusCode, body)
        Object.freeze(this)
    }

    /**
     * Creates a 200 response.
     *
     * @param {String} username
     * @returns {UpdateUserResponse}
     */
    static updateUserResponse(username) {
        const body = {
            message: `Successfully updated ${username} user.`
        }
        return new UpdateUserResponse(Response.StatusCode.OK, body)
    }

    /**
     * Creates a 404 response.
     *
     * @param {string} username
     * @returns {UpdateUserResponse}
     */
    static notFoundResponse(username) {
        const body = {
            code: Response.ErrorCode.USERNAME_NOT_FOUND,
            message: `User ${username} not found.`
        }
        return new UpdateUserResponse(Response.StatusCode.NOT_FOUND, body)
    }

    /**
     * Creates a 403 response for trying to update user with higher role.
     *
     * @returns {UpdateUserResponse}
     */
    static updateHigherRoleUserResponse() {
        const body = {
            code: Response.ErrorCode.NO_PERMISSION,
            message: 'Updating user with higher role is forbidden.'
        }
        return new UpdateUserResponse(Response.StatusCode.FORBIDDEN, body)
    }

    /**
     * Creates a 403 response for trying to update user to higher role than theres.
     * @param {Role} role
     * @returns {UpdateUserResponse}
     */
    static roleUpdateForbiddenResponse(role) {
        const body = {
            code: Response.ErrorCode.NO_PERMISSION,
            message: `Don\'t have permission to update to ${role} role.`
        }
        return new UpdateUserResponse(Response.StatusCode.FORBIDDEN, body)
    }
}

module.exports = UpdateUserResponse