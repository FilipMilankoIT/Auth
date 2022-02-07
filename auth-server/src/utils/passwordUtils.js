'use strict'

const bcrypt = require('bcryptjs')

/**
 * Generate a hash password from plain text password.
 *
 * @param {String} password - Plain text password.
 * @returns {String} - Hashed password.
 */
function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

/**
 * Checks if the plain text password matches with the hash password.
 *
 * @param {String} password - Plain text password.
 * @param {String} hashPassword - Hashed password.
 * @returns {Promise<Boolean>} - True if matched.
 */
async function compare(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword)
}

module.exports = {
    hashPassword,
    compare
}