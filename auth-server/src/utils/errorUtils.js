"use strict"

/**
 * Logs errors.
 *
 * @param {*} error
 */
function logError(error) {
    if (error instanceof Error) {
        console.error(error.stack)
    } else {
        console.error(JSON.stringify(error))
    }
}

module.exports = {
    logError
}