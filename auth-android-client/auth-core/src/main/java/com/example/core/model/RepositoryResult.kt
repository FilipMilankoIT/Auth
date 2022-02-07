package com.example.core.model

sealed class RepositoryResult<T> {
    class Success<T>(val data: T): RepositoryResult<T>()
    class Error<T>(val code: String, val message: String): RepositoryResult<T>()
    class NetworkError<T>(val message: String): RepositoryResult<T>()
    class UnknownError<T>(val message: String): RepositoryResult<T>()
}