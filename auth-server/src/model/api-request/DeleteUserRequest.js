'use strict'

const AuthorizedRequest = require('./AuthorizedRequest')
const {isNonEmptyString} = require('../../utils/utilFunctions')

/**
 * DeleteUserRequest class used for creating and verifying DELETE users/{username} API requests objects.
 */
class DeleteUserRequest extends AuthorizedRequest {

    /** @inheritDoc **/
    constructor(event) {
        super(event)
        if (this.path) {
            this.username = this.path.username
        }
        Object.freeze(this)
    }

    /** @inheritDoc **/
    verifyFields() {
        if (!isNonEmptyString(this.username)) {
            throw new Error('Invalid request. Missing username path parameter.')
        }
    }
}

module.exports = DeleteUserRequest