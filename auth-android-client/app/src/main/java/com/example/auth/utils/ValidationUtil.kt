package com.example.auth.utils

/**
 * Checks if the password is valid.
 * Valid password must must be at least eight characters, have at least one uppercase letter,
 * one lowercase letter, one number and one special character.
 *
 * @param password
 * @return True if password is valid and false otherwise.
 */
fun isPasswordValid(password: String): Boolean {
    val passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@\$!%*?&])[A-Za-z\\d@\$!%*?&]{8,}\$".toRegex()
    return passwordPattern.matches(password)
}