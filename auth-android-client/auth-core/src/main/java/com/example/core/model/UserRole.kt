package com.example.core.model

enum class UserRole(val value: String) {
    USER("user"),
    USER_MANAGER("user_manager"),
    ADMIN("admin");

    companion object {
        fun from(value: String?) =
            when(value) {
                USER_MANAGER.value -> USER_MANAGER
                ADMIN.value -> ADMIN
                else -> USER
            }
    }
}