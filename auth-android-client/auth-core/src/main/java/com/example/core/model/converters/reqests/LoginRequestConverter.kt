package com.example.core.model.converters.reqests

import com.example.api.model.requests.LoginRequestDTO
import com.example.core.model.requests.LoginRequest

internal fun LoginRequest.toModel() = LoginRequestDTO(username, password)