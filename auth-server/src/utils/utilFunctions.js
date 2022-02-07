'use strict'

/**
 * Check if an argument is a String.
 *
 * @param {*} arg
 * @returns {boolean} Returns true if argument is String.
 */
function isString(arg) {
    return typeof arg === 'string'
}

/**
 * Check if an argument is a non-empty String.
 *
 * @param {*} arg
 * @returns {boolean} Returns true if argument is a non-empty String.
 */
function isNonEmptyString(arg) {
    return isString(arg) && arg.length > 0
}

/**
 * Check if an argument is an Object.
 *
 * @param {*} arg
 * @returns {boolean} Returns true if argument is an Object.
 */
function isObject(arg) {
    return arg !== undefined && arg !== null && arg.constructor === Object;
}

/**
 * Check if an argument is a non-empty Object.
 *
 * @param {*} arg
 * @returns {boolean} Returns true if argument is a non-empty Object.
 */
function isNonEmptyObject(arg) {
    return isObject(arg) && Object.keys(arg).length > 0
}

/**
 * Check if an argument is a positive integer.
 *
 * @param {*} arg
 * @returns {boolean} Returns true if argument is a positive integer.
 */
function isPositiveInteger(arg) {
    return Number.isInteger(arg) && arg > 0
}

module.exports = {
    isString,
    isNonEmptyString,
    isObject,
    isNonEmptyObject,
    isPositiveInteger
}