'use strict'

const AuthorizedRequest = require('./AuthorizedRequest')
const {isNonEmptyString, isString, isInteger} = require('../../utils/utilFunctions')
const Role = require("../../model/Role").Role
const Gender = require("../../model/Gender")

/**
 * UpdateUserRequest class used for creating and verifying PATCH users/{username} API requests objects.
 */
class UpdateUserRequest extends AuthorizedRequest {

    /** @inheritDoc **/
    constructor(event) {
        super(event)
        if (this.path) {
            this.username = this.path.username
        }
        this.password = this.body.password
        this.role = this.body.role
        this.firstName = this.body.firstName
        this.lastName = this.body.lastName
        this.gender = this.body.gender
        this.birthday = this.body.birthday
        Object.freeze(this)
    }

    /** @inheritDoc **/
    verifyFields() {
        if (!isNonEmptyString(this.username)) {
            throw new Error('Invalid request. Missing username path parameter.')
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!this.password && !this.role && this.firstName === undefined && this.lastName === undefined && !this.gender
            && !this.birthday) {
            throw new Error('Invalid user update parameters.')
        }

        if (this.password && !passwordRegex.test(this.password)) {
            throw new Error('Invalid password. Password must be at least eight characters, have at least one ' +
                'uppercase letter, one lowercase letter, one number and one special character.')
        }

        if (this.role && !Object.values(Role).includes(this.role)) {
            throw new Error('Invalid role. Allowed roles: user, user_manager and admin.')
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

module.exports = UpdateUserRequest