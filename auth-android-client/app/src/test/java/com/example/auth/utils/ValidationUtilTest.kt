package com.example.auth.utils

import junit.framework.TestCase
import org.junit.Test

class ValidationUtilTest : TestCase() {

    @Test
    fun testIsPasswordValid_ValidPassword_True() {
        val password = "Pass123*"
        assertTrue(isPasswordValid(password))
    }

    @Test
    fun testIsPasswordValid_PasswordWithLessThenEightCharacters_False() {
        val password = "pas123*"
        assertFalse(isPasswordValid(password))
    }

    @Test
    fun testIsPasswordValid_PasswordWithoutUppercaseLetter_False() {
        val password = "pass123*"
        assertFalse(isPasswordValid(password))
    }

    @Test
    fun testIsPasswordValid_PasswordWithoutLowercaseLetter_False() {
        val password = "PASS123*"
        assertFalse(isPasswordValid(password))
    }

    @Test
    fun testIsPasswordValid_PasswordWithoutNumbers_False() {
        val password = "Password*"
        assertFalse(isPasswordValid(password))
    }

    @Test
    fun testIsPasswordValid_PasswordWithoutSpecialCharacters_False() {
        val password = "Pass1234"
        assertFalse(isPasswordValid(password))
    }
}