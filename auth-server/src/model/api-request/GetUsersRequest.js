'use strict'

const AuthorizedRequest = require('./AuthorizedRequest')

/**
 * GetUsersRequest class used for creating and verifying GET users API requests objects.
 */
class GetUsersRequest extends AuthorizedRequest {

    /** @inheritDoc **/
    constructor(event) {
        super(event)
        if (this.query) {
            this.limit = this.query.limit
            this.exclusiveStartKey = this.query.exclusiveStartKey
        }
        Object.freeze(this)
    }

    /** @inheritDoc **/
    verifyFields() {
    }
}

module.exports = GetUsersRequest