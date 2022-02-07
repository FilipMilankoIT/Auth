package com.example.api.model.requests

import androidx.annotation.Keep

/**
 * Class for register API request.
 *
 * @property username
 * @property password
 */
@Keep
data class RegisterRequestDTO(
    val username: String,
    val password: String,
    val firstName: String?,
    val lastName: String?,
    val gender: String?,
    val birthday: Long?
    )