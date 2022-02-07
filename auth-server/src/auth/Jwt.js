'use strict'

const jwt = require('jsonwebtoken')
const {isNonEmptyString} = require('../utils/utilFunctions')

/**
 * Jwt class for generating and verifies JWTs.
 */
class Jwt {

    /**
     * Constructor for Jwt class.
     *
     * @param {SecretKeyEntity} secretKeyEntity - SecretKeyEntity class object.
     */
    constructor(secretKeyEntity) {
        this.secretKeyEntity = secretKeyEntity
    }

    /**
     * Signs JWT token
     *
     * @param {string} username
     * @returns {Promise<string>} - Returns new token.
     */
    signsToken = async (username) => {
        console.log('Signing new JWT')

        const key = await this.secretKeyEntity.getLatestKey()

        if (!key) {
            throw new Error('Failed to get JWT key')
        }

        const payload = {
            username
        }

        const options = {
            algorithm: 'HS256',
            expiresIn: '1h',
            header: {
                kid: key.kid,
                typ: 'JWT'
            }
        }

        return jwt.sign(payload, key.secretKey, options)
    }

    /**
     * Checks if the authorization header is the correct format
     *
     * @param {string} authorizationHeader - Authorization header.
     * @returns {boolean} - Returns true if the authorization header has the valid format.
     */
    static authorizationRegexCheck(authorizationHeader) {
        const JWS_REGEX = /^Bearer\s[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/
        return JWS_REGEX.test(authorizationHeader)
    }

    /**
     * Extracts JWT from authorization header.
     *
     * @param {string} authorizationHeader - Authorization header.
     * @return {string} - Returns JWT.
     * @throws Error} - Throws error if failed to extract JWT.
     */
    static getTokenFromAuthorizationHeader(authorizationHeader) {
        if (Jwt.authorizationRegexCheck(authorizationHeader)) {
            return authorizationHeader.split(" ")[1]
        }
        throw new Error("Invalid bearer token.")
    }

    /**
     * Extracts kid from JWT.
     *
     * @param {string} token - JWT.
     * @return {string} - Returns kid.
     * @throws {Error} - Throws error if failed to extract kid.
     */
    static getKidFromToken(token) {
        const decodedToken = jwt.decode(token, {complete: true})
        if (decodedToken.header && isNonEmptyString(decodedToken.header.kid)) {
            return decodedToken.header.kid
        }
        throw Error("Missing kid in token")
    }

    /**
     * Extracts username from JWT.
     *
     * @param {string} token - JWT.
     * @return {string} - Returns username.
     * @throws {Error} - Throws error if failed to extract username.
     */
    static getUsernameFromToken(token) {
        const decodedToken = jwt.decode(token, {complete: true})
        if (decodedToken.payload && isNonEmptyString(decodedToken.payload.username)) {
            return decodedToken.payload.username
        }
        throw Error("Missing username in token")
    }

    /**
     * Verifies a JWT.
     *
     * @param {string} token - JWT.
     * @param {string} signingKey - Secret signing key.
     * @throws {Error} Throws error if JWT is not valid.
     */
    static verifyToken(token, signingKey) {
        const option = {
            algorithms: "HS256",
            maxAge: "1h"
        }
        jwt.verify(token, signingKey, option)
    }
}

module.exports = Jwt