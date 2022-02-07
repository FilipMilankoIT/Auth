package com.example.core.model.requests

import androidx.annotation.Keep

/**
 * Class for login API request.
 *
 * @property username
 * @property password
 */
@Keep
data class LoginRequest(val username: String, val password: String)