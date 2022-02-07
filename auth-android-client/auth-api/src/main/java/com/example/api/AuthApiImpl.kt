package com.example.api

import android.util.Log
import com.example.api.model.ApiResult
import com.example.api.model.requests.LoginRequestDTO
import com.example.api.model.requests.RegisterRequestDTO
import com.example.api.model.requests.UpdateProfileRequestDTO
import com.example.api.model.responses.ErrorResponseDTO
import com.example.api.model.responses.LoginResponseDTO
import com.example.api.model.responses.ResponseDTO
import com.google.gson.Gson
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.IOException

internal class AuthApiImpl(baseUrl: String): AuthApi {

    private val service: AuthApiRetrofit

    companion object {
        private const val TAG = "AuthApiImpl"
    }

    init {
        val interceptor = HttpLoggingInterceptor()
        interceptor.level = HttpLoggingInterceptor.Level.BODY
        val client = OkHttpClient.Builder().addInterceptor(interceptor).build()

        service = Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AuthApiRetrofit::class.java)
    }

    override suspend fun login(request: LoginRequestDTO): ApiResult<LoginResponseDTO> =
        getResponse { service.login(request) }

    override suspend fun register(request: RegisterRequestDTO): ApiResult<ResponseDTO> =
        getResponse { service.register(request) }

    override suspend fun updateProfile(
        authorization: String,
        username: String,
        request: UpdateProfileRequestDTO
    ): ApiResult<ResponseDTO> =
        getResponse { service.updateProfile(authorization, username, request) }

    override suspend fun deleteUser(
        authorization: String,
        username: String
    ): ApiResult<ResponseDTO> =
        getResponse { service.deleteUser(authorization, username) }

    private suspend fun <T> getResponse(apiCall: suspend () -> Response<T>): ApiResult<T> {
        try {
            val result = apiCall()
            return if (result.isSuccessful) {
                val body = result.body()
                if (body != null) {
                    ApiResult.Success(body)
                } else {
                    ApiResult.UnknownError("")
                }
            } else {
                val errorBody = result.errorBody()
                if (errorBody != null) {
                    val errorResponse: ErrorResponseDTO =
                        Gson().fromJson(errorBody.charStream(), ErrorResponseDTO::class.java)
                    Log.e(TAG, "${errorResponse.code}: ${errorResponse.message}")
                    if (errorResponse.code.isNullOrEmpty() && errorResponse.message == "Unauthorized")
                        ApiResult.SessionExpired()
                    else ApiResult.Error(
                        errorResponse.code ?: "",
                        errorResponse.message ?: ""
                    )
                } else {
                    ApiResult.UnknownError("")
                }
            }
        } catch (throwable: Throwable) {
            val message = throwable.message ?: ""
            Log.e(TAG, message)
            return if(throwable is IOException)
                    ApiResult.NetworkError(message)
                else
                    ApiResult.UnknownError(message)
        }
    }
}