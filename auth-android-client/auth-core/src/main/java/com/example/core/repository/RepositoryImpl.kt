package com.example.core.repository

import androidx.lifecycle.LiveData
import com.example.core.storage.DataProvider
import com.example.api.AuthApi
import com.example.api.model.ApiResult
import com.example.core.model.ErrorCode
import com.example.core.model.Profile
import com.example.core.model.RepositoryResult
import com.example.core.model.converters.reqests.toModel
import com.example.core.model.converters.responses.toModel
import com.example.core.model.requests.LoginRequest
import com.example.core.model.requests.RegisterRequest
import com.example.core.model.requests.UpdateProfileRequest
import com.example.core.model.responses.LoginResponse
import com.example.core.model.responses.Response
import com.example.core.utils.SingleLiveEvent

internal class RepositoryImpl(
    private val authApi: AuthApi,
    private val dataProvider: DataProvider
) : Repository {

    companion object {
        const val TOKEN_KEY = "token"
        const val PROFILE_KEY = "profile"
    }

    private val _onSignOut = SingleLiveEvent<Boolean>()
    private val onSignOut: LiveData<Boolean> = _onSignOut

    override suspend fun login(request: LoginRequest): RepositoryResult<LoginResponse> =
        when (val result = authApi.login(request.toModel())) {
            is ApiResult.Success -> {
                val loginResult = result.data.toModel()
                dataProvider.writeValue(TOKEN_KEY, "Bearer ${loginResult.token}")
                val profile = Profile(
                    loginResult.username,
                    loginResult.role,
                    loginResult.firstName,
                    loginResult.lastName,
                    loginResult.gender,
                    loginResult.birthday,
                )
                dataProvider.writeValue(PROFILE_KEY, profile)
                RepositoryResult.Success(loginResult)
            }
            is ApiResult.Error -> RepositoryResult.Error(result.code, result.message)
            is ApiResult.NetworkError -> RepositoryResult.NetworkError(result.message)
            is ApiResult.UnknownError -> RepositoryResult.UnknownError(result.message)
            is ApiResult.SessionExpired -> RepositoryResult.Error(ErrorCode.UNAUTHORIZED.code, "")
        }

    override suspend fun register(request: RegisterRequest): RepositoryResult<Response> =
        when (val result = authApi.register(request.toModel())) {
            is ApiResult.Success -> RepositoryResult.Success(result.data.toModel())
            is ApiResult.Error -> RepositoryResult.Error(result.code, result.message)
            is ApiResult.NetworkError -> RepositoryResult.NetworkError(result.message)
            is ApiResult.UnknownError -> RepositoryResult.UnknownError(result.message)
            is ApiResult.SessionExpired -> RepositoryResult.Error(ErrorCode.UNAUTHORIZED.code, "")
        }

    override fun signOut() {
        dataProvider.remove(TOKEN_KEY)
        dataProvider.remove(PROFILE_KEY)
        _onSignOut.value = true
    }

    override fun onSignOut(): LiveData<Boolean> = onSignOut

    override fun getToken() = dataProvider.readValue<String>(TOKEN_KEY, String::class.java)

    override fun getProfile(): Profile? = dataProvider.readValue(PROFILE_KEY, Profile::class.java)

    override suspend fun updateProfile(request: UpdateProfileRequest): RepositoryResult<Response> =
        when (val result = authApi.updateProfile(getToken() ?: "",
            request.profile.username, request.toModel())) {
            is ApiResult.Success -> {
                dataProvider.writeValue(PROFILE_KEY, request.profile)
                RepositoryResult.Success(result.data.toModel())
            }
            is ApiResult.Error -> RepositoryResult.Error(result.code, result.message)
            is ApiResult.NetworkError -> RepositoryResult.NetworkError(result.message)
            is ApiResult.UnknownError -> RepositoryResult.UnknownError(result.message)
            is ApiResult.SessionExpired -> {
                signOut()
                RepositoryResult.Error(ErrorCode.UNAUTHORIZED.code, "")
            }
        }

    override suspend fun deleteUser(): RepositoryResult<Response> =
        when (val result = authApi.deleteUser(getToken() ?: "",
            getProfile()?.username ?: "")) {
            is ApiResult.Success -> {
                signOut()
                RepositoryResult.Success(result.data.toModel())
            }
            is ApiResult.Error -> RepositoryResult.Error(result.code, result.message)
            is ApiResult.NetworkError -> RepositoryResult.NetworkError(result.message)
            is ApiResult.UnknownError -> RepositoryResult.UnknownError(result.message)
            is ApiResult.SessionExpired -> {
                signOut()
                RepositoryResult.Error(ErrorCode.UNAUTHORIZED.code, "")
            }
        }
}