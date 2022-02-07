package com.example.api.model.requests

import androidx.annotation.Keep

@Keep
data class UpdateProfileRequestDTO(
    val firstName: String?,
    val lastName: String?,
    val gender: String?,
    val birthday: Long?
    )