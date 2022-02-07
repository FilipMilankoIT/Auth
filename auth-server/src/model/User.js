'use strict'

const {hashPassword} = require("../utils/passwordUtils");

/**
 * User data class.
 */
class User {

    /**
     * Constructor for User class.
     *
     * @param {string} username - Username.
     * @param {string} password - User's plain text password.
     * @param {Role} role - User role.
     * @param {string} [firstName] - User's first name.
     * @param {string} [lastName] - User's last name.
     * @param {Gender} [gender] - User's gender.
     * @param {number} [birthday] - User's birthday.
     */
    constructor(username, password, role, firstName, lastName, gender,
                birthday) {
        this.username = username
        this.hashPassword = password ? hashPassword(password) : undefined
        this.role = role
        this.firstName = firstName
        this.lastName = lastName
        this.gender = gender
        this.birthday = birthday
        Object.freeze(this)
    }
}

module.exports = User