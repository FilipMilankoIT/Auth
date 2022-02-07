package com.example.auth.ui.activities.auth.fragments.login

import androidx.lifecycle.*
import com.example.auth.R
import com.example.core.model.ErrorCode
import com.example.core.model.RepositoryResult
import com.example.core.model.requests.LoginRequest
import com.example.core.repository.Repository
import com.example.core.utils.SingleLiveEvent
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(private val repository: Repository) : ViewModel() {

    private val _isPasswordShown = MutableLiveData(false)
    val isPasswordShown: LiveData<Boolean> = _isPasswordShown

    private val _usernameError = MutableLiveData<Int?>(null)
    val usernameError: LiveData<Int?> = _usernameError

    private val _passwordError = MutableLiveData<Int?>(null)
    val passwordError: LiveData<Int?> = _passwordError

    private val _isUserLoggedIn = SingleLiveEvent<Boolean>()
    val isUserLoggedIn: LiveData<Boolean> = _isUserLoggedIn

    private val _error = SingleLiveEvent<Int>()
    val error: LiveData<Int> = _error

    private val _waiting = SingleLiveEvent<Boolean>()
    val waiting: LiveData<Boolean> = _waiting

    init {
        _isUserLoggedIn.value = !repository.getToken().isNullOrBlank()
    }

    fun togglePasswordVisibility() {
        _isPasswordShown.value = _isPasswordShown.value != true
    }

    /**
     * Validates form submit and triggers login request if valid.
     */
    fun submit(username: String, password: String) {
        var valid = true

        if (username.isBlank()) {
            _usernameError.value = R.string.empty_username
            valid = false
        } else {
            _usernameError.value = null
        }
        if (password.isBlank()) {
            _passwordError.value = R.string.empty_password
            valid = false
        } else {
            _passwordError.value = null
        }

        if (valid) {
            val loginRequest = LoginRequest(username, password)
            login(loginRequest)
        }
    }

    /**
     * Sends login request to the API.
     *
     * @param request
     */
    private fun login(request: LoginRequest) = viewModelScope.launch {
        _waiting.value = true
        when(val response = repository.login(request)) {
            is RepositoryResult.Success -> _isUserLoggedIn.value = true
            is RepositoryResult.Error -> {
                _error.value = when(ErrorCode.from(response.code)) {
                    ErrorCode.USERNAME_NOT_FOUND, ErrorCode.UNAUTHORIZED ->
                        R.string.error_login
                    else -> R.string.error_unknown
                }
            }
            is RepositoryResult.NetworkError -> _error.value = R.string.error_no_network
            is RepositoryResult.UnknownError -> _error.value = R.string.error_unknown
        }
        _waiting.value = false
    }
}