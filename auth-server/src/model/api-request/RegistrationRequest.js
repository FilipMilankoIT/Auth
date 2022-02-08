'use strict'

const Request = require('./Request')
const Gender = require('../../model/Gender')
const {isNonEmptyString, isString, isInteger} = require('../../utils/utilFunctions')

/**
 * RegistrationRequest class used for creating and verifying register API requests objects.
 */
class RegistrationRequest extends Request {

    /** @inheritDoc **/
    constructor(event) {
        super(event)
        this.username = this.body.username
        this.password = this.body.password
        this.firstName = this.body.firstName
        this.lastName = this.body.lastName
        this.gender = this.body.gender
        this.birthday = this.body.birthday
        Object.freeze(this)
    }

    /** @inheritDoc **/
    verifyFields() {
        if (!isNonEmptyString(this.username)) {
            throw new Error('Invalid username. Username must be a non empty string.')
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!passwordRegex.test(this.password)) {
            throw new Error('Invalid password. Password must be at least eight characters, have at least one ' +
                'uppercase letter, one lowercase letter, one number and one special character.')
        }

        if (this.firstName && !isString(this.firstName)) {
            throw new Error('Invalid first name. First name must be a string.')
        }

        if (this.lastName && !isString(this.lastName)) {
            throw new Error('Invalid last name. Last name must be a string.')
        }

        if (this.gender && !Object.values(Gender).includes(this.gender)) {
            throw new Error('Invalid gender. Allowed gender: male, female and other.')
        }

        if (this.birthday && !isInteger(this.birthday)) {
            throw new Error('Invalid birthday. Birthday need to be a timestamp in milliseconds.')
        }
    }
}

module.exports = RegistrationRequest