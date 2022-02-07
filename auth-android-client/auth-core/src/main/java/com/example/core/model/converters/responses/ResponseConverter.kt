package com.example.core.model.converters.responses

import com.example.api.model.responses.ResponseDTO
import com.example.core.model.responses.Response

internal fun ResponseDTO.toModel() = Response(message ?: "")