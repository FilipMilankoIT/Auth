'use strict'

const Response = require('../../model/api-response/Response')
const RegisterRequest = require('../../model/api-request/RegistrationRequest')
const RegisterResponse = require('../../model/api-response/RegistrationResponse')
const UserEntity = require('../../databse/UserEntity')
const User = require('../../model/User')
const Role = require('../../model/Role').Role
const {logError} = require('../../utils/errorUtils')

/**
 * Registration Lambda function handler for responding to registration API requests.
 *
 * @param {Object} event - Lambda event.
 * @returns {Promise<Response>} - Returns REST API response.
 */
module.exports.handler = async (event) => {
    console.log("Received event:\n", JSON.stringify(event))

    let request

    try {
        request = new RegisterRequest(event)
        console.log("Received request:\n", JSON.stringify(request))

        request.verify()
    } catch (error) {
        logError(error)
        return RegisterResponse.badRequestResponse(Response.ErrorCode.INVALID_BODY, error.message)
    }

    const userEntity = new UserEntity(process.env.userTable)

    if (await userEntity.get(request.username)) {
        console.error(`Username ${request.username} is already registered`)
        return RegisterResponse.conflictResponse();
    }

    try {
        const user = new User(
            request.username,
            request.password,
            Role.USER,
            request.firstName,
            request.lastName,
            request.gender,
            request.birthday
        )
        await userEntity.put(user)
    } catch (error) {
        logError(error)
        return RegisterResponse.internalErrorResponse();
    }

    console.log('User is successfully registered')

    return RegisterResponse.createdResponse();
}