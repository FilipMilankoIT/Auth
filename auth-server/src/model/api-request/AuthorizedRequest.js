'use strict'

const Request = require('./Request')
const {getTokenFromAuthorizationHeader, getUsernameFromToken} = require('../../auth/Jwt')

/**
 * Abstract AuthorizedRequest class used for non-public API requests.
 */
class AuthorizedRequest extends Request {

    /** @inheritDoc **/
    constructor(event) {
        super(event)
        if (this.constructor === AuthorizedRequest) {
            throw new Error('Abstract classes can\'t be instantiated')
        }
        this.senderUsername = AuthorizedRequest.getUsernameFromEvent(event)
    }

    /**
     * Get username from Lambda event.
     *
     * @param {Object} event - Lambda event.
     * @return {string} - Returns username.
     * @throws {Error} - Throws error if failed to extract username.
     */
    static getUsernameFromEvent(event) {
        if (!event.headers || !event.headers.Authorization) {
            throw new Error("Missing Authorization header in event.")
        }
        const token = getTokenFromAuthorizationHeader(event.headers.Authorization)
        return getUsernameFromToken(token)
    }
}

module.exports = AuthorizedRequest