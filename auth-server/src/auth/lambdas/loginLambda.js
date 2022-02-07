'use strict'

const Response = require('../../model/api-response/Response')
const LoginRequest = require('../../model/api-request/LoginRequest')
const LoginResponse = require('../../model/api-response/LoginResponse')
const UserEntity = require('../../databse/UserEntity')
const SecretKeyEntity = require('../../databse/SecretKeyEntity')
const Jwt = require('../Jwt')
const {compare} = require("../../utils/passwordUtils")
const {logError} = require('../../utils/errorUtils')

/**
 * Login Lambda function handler for responding to login API requests.
 *
 * @param {Object} event - Lambda event.
 * @returns {Promise<Response>} - Returns REST API response.
 */
module.exports.handler = async (event) => {
    console.log("Received event:\n", JSON.stringify(event))

    let request

    try {
        request = new LoginRequest(event)
        console.log("Received request:\n", JSON.stringify(request))

        request.verify()
    } catch (error) {
        logError(error)
        return LoginResponse.badRequestResponse(Response.ErrorCode.INVALID_BODY, error.message)
    }

    const userEntity = new UserEntity(process.env.userTable)

    const user = await userEntity.get(request.username)

    if (!user) {
        console.error(`Username ${request.username} not found`)
        return LoginResponse.usernameNotFoundResponse(request.username);
    }

    if(!(await compare(request.password, user.hashPassword))) {
        console.error(`Password is incorrect`)
        return LoginResponse.unauthorizedResponse();
    }

    try {
        const jwt = new Jwt(new SecretKeyEntity(process.env.secretKeyTable))
        const token = await jwt.signsToken(request.username)

        console.log('Sending back token to authenticated user')

        return LoginResponse.okResponse(token, user)
    } catch (error) {
        logError(error)
        return LoginResponse.internalErrorResponse();
    }
}