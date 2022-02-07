'use strict'

const SecretKeyEntity = require('../../databse/SecretKeyEntity')
const {v4: uuidv4} = require('uuid')

/**
 * Handler for a cron job Lambda function that generates a new and deletes old secret keys, that are used for creating
 * and verifying JWT.
 */
module.exports.handler = async () => {
    console.log('Generating new secret key...')

    const secretKeyEntity = new SecretKeyEntity(process.env.secretKeyTable)

    const newKey = new SecretKeyEntity.SecretKey(uuidv4(), uuidv4())

    await secretKeyEntity.put(newKey)
    console.log('Successfully added a new secret key')

    await secretKeyEntity.deleteOldKeys()
}