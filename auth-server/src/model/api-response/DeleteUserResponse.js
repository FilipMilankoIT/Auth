'use strict'

const Response = require('./Response')

/**
 * DeleteUserResponse class used for creating REST responses for DELETE users/{username} API.
 */
class DeleteUserResponse extends Response {

    /** @inheritDoc **/
    constructor(statusCode, body) {
        super(statusCode, body)
        Object.freeze(this)
    }

    /**
     * Creates a 200 response.
     *
     * @param {string} username
     * @returns {DeleteUserResponse}
     */
    static okResponse(username) {
        const body = {
            message: `Successfully deleted ${username} user.`
        }
        return new DeleteUserResponse(Response.StatusCode.OK, body)
    }

    /**
     * Creates a 404 response.
     *
     * @param {string} username
     * @returns {DeleteUserResponse}
     */
    static notFoundResponse(username) {
        const body = {
            code: Response.ErrorCode.USERNAME_NOT_FOUND,
            message: `User ${username} not found.`
        }
        return new DeleteUserResponse(Response.StatusCode.NOT_FOUND, body)
    }

    /**
     * Creates a 403 response for trying to delete user with higher role.
     *
     * @returns {DeleteUserResponse}
     */
    static deleteHigherRoleUserResponse() {
        const body = {
            code: Response.ErrorCode.NO_PERMISSION,
            message: 'Deleting user with higher role is forbidden.'
        }
        return new DeleteUserResponse(Response.StatusCode.FORBIDDEN, body)
    }
}

module.exports = DeleteUserResponse