package com.example.core.model.responses

import androidx.annotation.Keep
import com.example.core.model.Gender
import com.example.core.model.UserRole

/**
 * Class for login API response.
 *
 * @property token
 * @property role
 */
@Keep
data class LoginResponse(
    val token: String,
    val username: String,
    val role: UserRole,
    val firstName: String?,
    val lastName: String?,
    val gender: Gender?,
    val birthday: Long?
    )