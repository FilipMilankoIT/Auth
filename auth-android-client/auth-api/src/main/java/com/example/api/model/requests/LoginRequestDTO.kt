package com.example.api.model.requests

import androidx.annotation.Keep

/**
 * Class for login API request.
 *
 * @property username
 * @property password
 */
@Keep
data class LoginRequestDTO(val username: String, val password: String)