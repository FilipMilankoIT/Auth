package com.example.api.model.responses

import androidx.annotation.Keep

/**
 * Class for login API response.
 *
 * @property token
 * @property role
 */
@Keep
data class LoginResponseDTO(
    val token: String?,
    val username: String?,
    val role: String?,
    val firstName: String?,
    val lastName: String?,
    val gender: String?,
    val birthday: Long?
    )