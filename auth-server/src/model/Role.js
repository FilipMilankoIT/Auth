'use strict'

/**
 * Enum object for user role.
 *
 * @type {Readonly<{USER: string, USER_MANAGER: string, ADMIN: string}>}
 * @enum {string}
 */
const Role = Object.freeze({
    USER: "user",
    USER_MANAGER: "user_manager",
    ADMIN: "admin"
})

/**
 * Get the rank of a role.
 *
 * @param {Role} role
 * @returns {number}
 */
function getRoleRank(role) {
    switch (role) {
        case Role.USER:
            return 1
        case Role.USER_MANAGER:
            return 2
        case Role.ADMIN:
            return 3
        default:
            return 0
    }
}

module.exports = {
    Role,
    getRoleRank
}