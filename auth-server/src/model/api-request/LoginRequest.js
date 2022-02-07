'use strict'

const Request = require('./Request')
const {isNonEmptyString} = require('../../utils/utilFunctions')

/**
 * LoginRequest class used for creating and verifying login API requests objects.
 */
class LoginRequest extends Request {

    /** @inheritDoc **/
    constructor(event) {
        super(event)
        this.username = this.body.username
        this.password = this.body.password
        Object.freeze(this)
    }

    /** @inheritDoc **/
    verifyFields() {
        if (!isNonEmptyString(this.username)) {
            throw new Error('Invalid username. Username must be a non empty string.')
        }

        if (!isNonEmptyString(this.password)) {
            throw new Error('Invalid password. Password must be a non empty string.')
        }
    }
}

module.exports = LoginRequest