package com.example.core.model.converters.reqests

import com.example.api.model.requests.UpdateProfileRequestDTO
import com.example.core.model.requests.UpdateProfileRequest

internal fun UpdateProfileRequest.toModel() = UpdateProfileRequestDTO(
    profile.firstName,
    profile.lastName,
    profile.gender?.value,
    profile.birthday
)