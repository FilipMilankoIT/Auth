package com.example.api.model

sealed class ApiResult<T> {
    class Success<T>(val data:T): ApiResult<T>()
    class Error<T>(val code: String, val message: String): ApiResult<T>()
    class NetworkError<T>(val message: String): ApiResult<T>()
    class UnknownError<T>(val message: String): ApiResult<T>()
    class SessionExpired<T>(): ApiResult<T>()
}