'use strict'

const Response = require('./Response')
const {User} = require('../../model/User')

/**
 * LoginResponse class used for creating REST responses for login API.
 */
class LoginResponse extends Response {

    /** @inheritDoc **/
    constructor(statusCode, body) {
        super(statusCode, body)
        Object.freeze(this)
    }

    /**
     * Creates a 200 response.
     *
     * @param {string} token - JWT.
     * @param {User} user
     * @returns {LoginResponse}
     */
    static okResponse(token, user) {
        const body = {
            token,
            username: user.username
        }
        if (user.firstName) {
            body.firstName = user.firstName
        }
        if (user.lastName) {
            body.lastName = user.lastName
        }
        if (user.gender) {
            body.gender = user.gender
        }
        if (user.birthday) {
            body.birthday = user.birthday
        }
        return new LoginResponse(Response.StatusCode.OK, body)
    }

    /**
     * Creates a 400 error response for username not found.
     *
     * @param {string} username
     * @returns {Response}
     */
    static usernameNotFoundResponse(username) {
        return this.badRequestResponse(
            Response.ErrorCode.USERNAME_NOT_FOUND,
            `The username ${username} does not exist.`
        )
    }

    /**
     * Creates a 401 error response.
     *
     * @returns {LoginResponse}
     */
    static unauthorizedResponse() {
        const body = {
            code: Response.ErrorCode.UNAUTHORIZED,
            message: 'Username and password do not match.'
        }
        return new LoginResponse(Response.StatusCode.UNAUTHORIZED, body)
    }
}

module.exports = LoginResponse