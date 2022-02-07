package com.example.api

import com.example.api.model.requests.LoginRequestDTO
import com.example.api.model.requests.RegisterRequestDTO
import com.example.api.model.requests.UpdateProfileRequestDTO
import com.example.api.model.responses.LoginResponseDTO
import com.example.api.model.responses.ResponseDTO
import retrofit2.Response
import retrofit2.http.*

internal interface AuthApiRetrofit {

    @POST("login")
    suspend fun login(@Body request: LoginRequestDTO): Response<LoginResponseDTO>

    @POST("register")
    suspend fun register(@Body request: RegisterRequestDTO): Response<ResponseDTO>

    @PATCH("users/{username}")
    suspend fun updateProfile(
        @Header("Authorization") authorization: String,
        @Path("username") username: String,
        @Body request: UpdateProfileRequestDTO
    ): Response<ResponseDTO>

    @DELETE("users/{username}")
    suspend fun deleteUser(
        @Header("Authorization") authorization: String,
        @Path("username") username: String
    ): Response<ResponseDTO>
}