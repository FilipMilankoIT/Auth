package com.example.core.model

enum class ErrorCode(val code: String) {
    UNKNOWN("Unknown"),
    UNAUTHORIZED("Unauthorized"),
    INVALID_BODY("InvalidBody"),
    USERNAME_NOT_FOUND("UsernameNotFound"),
    USERNAME_ALREADY_EXISTS("UsernameAlreadyExists"),
    NO_PERMISSION("NoPermission");

    companion object {
        fun from(code: String?) =
            when(code) {
                UNAUTHORIZED.code -> UNAUTHORIZED
                INVALID_BODY.code -> INVALID_BODY
                USERNAME_NOT_FOUND.code -> USERNAME_NOT_FOUND
                USERNAME_ALREADY_EXISTS.code -> USERNAME_ALREADY_EXISTS
                NO_PERMISSION.code -> NO_PERMISSION
                else -> UNKNOWN
            }
    }
}