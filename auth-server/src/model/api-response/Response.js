'use strict'

/**
 * Abstract Response class used for creating REST API responses.
 */
class Response {

    /**
     * Enum object for REST API status codes.
     *
     * @type {
     *      Readonly<{
     *          OK: number,
     *          CREATED: number,
     *          BAD_REQUEST: number,
     *          UNAUTHORIZED: number,
     *          INTERNAL_SERVER_ERROR: number
     *      }>
     * }
     * @enum {number}
     */
    static StatusCode = Object.freeze({
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500
    })

    /**
     * Enum object for API error codes.
     *
     * @type {
     *      Readonly<{
     *          UNKNOWN: String,
     *          INVALID_BODY: String,
     *          USERNAME_NOT_FOUND: String,
     *          USERNAME_ALREADY_EXISTS: String,
     *          NO_PERMISSION: String
     *      }>
     * }
     * @enum {number}     */
    static ErrorCode = Object.freeze({
        UNKNOWN: 'Unknown',
        UNAUTHORIZED: 'Unauthorized',
        INVALID_BODY: 'InvalidBody',
        USERNAME_NOT_FOUND: 'UsernameNotFound',
        USERNAME_ALREADY_EXISTS: 'UsernameAlreadyExists',
        NO_PERMISSION: 'NoPermission'
    })

    /**
     * Constructor for Response class.
     * @constructor
     * @abstract
     *
     * @param {StatusCode} statusCode - REST API status code.
     * @param {Object} body - Response body.
     */
    constructor(statusCode, body) {
        this.statusCode = statusCode
        this.headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
        this.body = JSON.stringify(body)

        Object.freeze(this)
    }

    /**
     * Creates a 400 error response.
     *
     * @param {string} code - Error code.
     * @param {string} message - Error message.
     * @returns {Response}
     */
    static badRequestResponse(code, message) {
        const body = {
            code,
            message
        }
        return new Response(Response.StatusCode.BAD_REQUEST, body)
    }

    /**
     * Creates a 403 error response.
     *
     * @returns {Response}
     */
    static forbiddenResponse() {
        const body = {
            code: Response.ErrorCode.NO_PERMISSION,
            message: 'You don\'t have permission for this request.'
        }
        return new Response(Response.StatusCode.FORBIDDEN, body)
    }

    /**
     * Creates a 500 error response.
     *
     * @returns {Response}
     */
    static internalErrorResponse() {
        const body = {
            code: Response.ErrorCode.UNKNOWN,
            message: "Internal server error."
        }
        return new Response(Response.StatusCode.INTERNAL_SERVER_ERROR, body)
    }
}

module.exports = Response