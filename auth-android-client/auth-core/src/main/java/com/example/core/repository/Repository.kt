package com.example.core.repository

import androidx.lifecycle.LiveData
import com.example.core.model.Profile
import com.example.core.model.RepositoryResult
import com.example.core.model.requests.LoginRequest
import com.example.core.model.requests.RegisterRequest
import com.example.core.model.requests.UpdateProfileRequest
import com.example.core.model.responses.LoginResponse
import com.example.core.model.responses.Response

interface Repository {

    suspend fun login(request: LoginRequest): RepositoryResult<LoginResponse>

    suspend fun register(request: RegisterRequest): RepositoryResult<Response>

    fun signOut()

    fun onSignOut() : LiveData<Boolean>

    fun getToken(): String?

    fun getProfile(): Profile?

    suspend fun updateProfile(request: UpdateProfileRequest): RepositoryResult<Response>

    suspend fun deleteUser(): RepositoryResult<Response>
}