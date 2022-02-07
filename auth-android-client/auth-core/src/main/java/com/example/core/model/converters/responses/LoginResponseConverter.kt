package com.example.core.model.converters.responses

import com.example.api.model.responses.LoginResponseDTO
import com.example.core.model.Gender
import com.example.core.model.UserRole
import com.example.core.model.responses.LoginResponse

internal fun LoginResponseDTO.toModel() = LoginResponse(
    token ?: "",
    username ?: "",
    UserRole.from(role),
    firstName,
    lastName,
    Gender.from(gender),
    birthday
)