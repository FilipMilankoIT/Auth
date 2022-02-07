'use strict'

/**
 * Enum object for gender.
 *
 * @type {Readonly<{MALE: string, FEMALE: string, OTHER: string}>}
 * @enum {string}
 */
const Gender = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "other"
})

module.exports = Gender
