package com.example.api.di

import com.example.api.AuthApi
import com.example.api.AuthApiImpl

object ApiProvider {

    fun getAuthApi(baseUrl: String): AuthApi {
        return AuthApiImpl(baseUrl)
    }
}