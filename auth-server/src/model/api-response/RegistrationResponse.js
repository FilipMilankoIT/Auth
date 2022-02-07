'use strict'

const Response = require('./Response')

/**
 * RegistrationResponse class used for creating REST responses for register API.
 */
class RegistrationResponse extends Response {

    /** @inheritDoc **/
    constructor(statusCode, body) {
        super(statusCode, body)
        Object.freeze(this)
    }

    /**
     * Creates a 201 response.
     *
     * @returns {RegistrationResponse}
     */
    static createdResponse() {
        const body = {
            message: "User was successfully registered."
        }
        return new RegistrationResponse(Response.StatusCode.CREATED, body)
    }

    /**
     * Creates a 409 error response.
     *
     * @returns {RegistrationResponse}
     */
    static conflictResponse() {
        const body = {
            code: Response.ErrorCode.USERNAME_ALREADY_EXISTS,
            message: "This username is already registered."
        }
        return new RegistrationResponse(Response.StatusCode.CONFLICT, body)
    }
}

module.exports = RegistrationResponse