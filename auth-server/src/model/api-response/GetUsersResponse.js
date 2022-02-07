'use strict'

const Response = require('./Response')

/**
 * GetUsersResponse class used for creating REST responses for GET users API.
 */
class GetUsersResponse extends Response {

    /** @inheritDoc **/
    constructor(statusCode, body) {
        super(statusCode, body)
        Object.freeze(this)
    }

    /**
     * Creates a 200 response.
     *
     * @param {User[]} users - Array of User objects.
     * @param {string} lastEvaluatedKey
     * @returns {GetUsersResponse}
     */
    static okResponse(users, lastEvaluatedKey) {
        const body = {
            users,
            lastEvaluatedKey
        }
        return new GetUsersResponse(Response.StatusCode.OK, body)
    }
}

module.exports = GetUsersResponse