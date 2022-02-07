'use strict'

const {logError} = require('../../utils/errorUtils')

/**
 * Abstract Request class used for REST API requests.
 */
class Request {

    /**
     * Constructor for Request class.
     * @constructor
     * @abstract
     *
     * @param {Object} event - Lambda event.
     */
    constructor(event) {
        if (this.constructor === Request) {
            throw new Error('Abstract classes can\'t be instantiated')
        }

        try {
            this.body = JSON.parse(event.body)
        } catch (error) {
            logError(error)
            throw new Error("Invalid request body format.")
        }
        this.path = event.pathParameters
        this.query = event.queryStringParameters
    }

    /**
     * Verifies if request is valid.
     *
     * @throws - Throws Error is request is nad valid.
     */
    verify() {
        console.log("Verifying request...")
        this.verifyFields()
        console.log("Request is valid")
    }

    /**
     * Verifies if request fields are valid.
     *
     * @throws - Throws Error is request is nad valid.
     */
    verifyFields() {
        throw new Error('Method not implemented')
    }
}

module.exports = Request