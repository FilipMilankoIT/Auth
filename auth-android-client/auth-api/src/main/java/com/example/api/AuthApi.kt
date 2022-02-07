package com.example.api

import com.example.api.model.ApiResult
import com.example.api.model.requests.LoginRequestDTO
import com.example.api.model.requests.RegisterRequestDTO
import com.example.api.model.requests.UpdateProfileRequestDTO
import com.example.api.model.responses.LoginResponseDTO
import com.example.api.model.responses.ResponseDTO

interface AuthApi {

    suspend fun login(request: LoginRequestDTO): ApiResult<LoginResponseDTO>

    suspend fun register(request: RegisterRequestDTO): ApiResult<ResponseDTO>

    suspend fun updateProfile(
        authorization: String,
        username: String,
        request: UpdateProfileRequestDTO
    ): ApiResult<ResponseDTO>

    suspend fun deleteUser(
        authorization: String,
        username: String
    ): ApiResult<ResponseDTO>
}