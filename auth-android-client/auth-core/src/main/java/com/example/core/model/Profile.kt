package com.example.core.model

import androidx.annotation.Keep

@Keep
data class Profile(
    val username: String,
    val role: UserRole,
    val firstName: String?,
    val lastName: String?,
    val gender: Gender?,
    val birthday: Long?
    )