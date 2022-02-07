package com.example.core.model

import junit.framework.TestCase
import org.junit.Test

class UserRoleTest : TestCase() {

    @Test
    fun testGet_user_UserRole() {
        val result = UserRole.from("user")
        assertEquals(UserRole.USER, result)
    }

    @Test
    fun testGet_user_manager_UserManagerRole() {
        val result = UserRole.from("user_manager")
        assertEquals(UserRole.USER_MANAGER, result)
    }

    @Test
    fun testGet_user_manager_AdminRole() {
        val result = UserRole.from("admin")
        assertEquals(UserRole.ADMIN, result)
    }

    @Test
    fun testGet_invalidRoleText_null() {
        val result = UserRole.from("super_admin")
        assertEquals(UserRole.USER, result)
    }

    @Test
    fun testGet_nullRoleText_null() {
        val result = UserRole.from(null)
        assertEquals(UserRole.USER, result)
    }
}