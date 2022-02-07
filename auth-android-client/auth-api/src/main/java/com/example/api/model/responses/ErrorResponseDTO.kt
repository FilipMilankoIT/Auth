package com.example.api.model.responses

import androidx.annotation.Keep

@Keep
data class ErrorResponseDTO(val code: String?, val message: String?)