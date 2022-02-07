package com.example.auth.ui.activities.auth.fragments.register

import androidx.lifecycle.*
import com.example.auth.R
import com.example.auth.utils.isPasswordValid
import com.example.core.model.ErrorCode
import com.example.core.model.Gender
import com.example.core.model.RepositoryResult
import com.example.core.model.requests.RegisterRequest
import com.example.core.repository.Repository
import com.example.core.utils.SingleLiveEvent
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class RegisterViewModel @Inject constructor(private val repository: Repository) : ViewModel() {

    private val _isPasswordShown = MutableLiveData(false)
    val isPasswordShown: LiveData<Boolean> = _isPasswordShown

    private val _isConfirmPasswordShown = MutableLiveData(false)
    val isConfirmPasswordShown: LiveData<Boolean> = _isConfirmPasswordShown

    private val _gender = MutableLiveData<Gender?>(null)
    val gender: LiveData<Gender?> = _gender

    private val _birthday = MutableLiveData<Long?>(null)
    val birthday: LiveData<Long?> = _birthday

    private val _usernameError = MutableLiveData<Int?>(null)
    val usernameError: LiveData<Int?> = _usernameError

    private val _passwordError = MutableLiveData<Int?>(null)
    val passwordError: LiveData<Int?> = _passwordError

    private val _confirmPasswordError = MutableLiveData<Int?>(null)
    val confirmPasswordError: LiveData<Int?> = _confirmPasswordError

    private val _isUserRegistered = SingleLiveEvent<Boolean>()
    val isUserRegistered: LiveData<Boolean> = _isUserRegistered

    private val _error = SingleLiveEvent<Int>()
    val error: LiveData<Int> = _error

    private val _waiting = SingleLiveEvent<Boolean>()
    val waiting: LiveData<Boolean> = _waiting

    fun togglePasswordVisibility() {
        _isPasswordShown.value = _isPasswordShown.value != true
    }

    fun toggleConfirmPasswordVisibility() {
        _isConfirmPasswordShown.value = _isConfirmPasswordShown.value != true
    }

    fun setGender(gender: Gender) {
        _gender.value = gender
    }

    fun setBirthday(birthday: Long) {
        _birthday.value = birthday
    }

    /**
     * Validates form submit and triggers register request if valid.
     */
    fun submit(
        username: String,
        password: String,
        confirmPassword: String,
        firstName: String?,
        lastName: String?,
    ) {
        var valid = true

        if (username.isBlank()) {
            _usernameError.value = R.string.empty_username
            valid = false
        }

        if (password.isBlank()) {
            _passwordError.value = R.string.empty_password
            valid = false
        } else if (!isPasswordValid(password)) {
            _passwordError.value = R.string.invalid_password
            valid = false
        } else {
            _passwordError.value = null
        }

        if (password != confirmPassword) {
            _confirmPasswordError.value = R.string.invalid_confirm_password
            valid = false
        } else {
            _confirmPasswordError.value = null
        }

        if (valid) {
            val registerRequest = RegisterRequest(username, password, firstName, lastName,
                gender.value?.value, birthday.value)
            register(registerRequest)
        }
    }

    /**
     * Sends register request to the API.
     *
     * @param request
     */
    private fun register(request: RegisterRequest) = viewModelScope.launch {
        _waiting.value = true
        when(val response = repository.register(request)) {
            is RepositoryResult.Success -> _isUserRegistered.value = true
            is RepositoryResult.Error -> {
                _error.value = when(ErrorCode.from(response.code)) {
                    ErrorCode.USERNAME_ALREADY_EXISTS -> R.string.error_username_already_exists
                    else -> R.string.error_unknown
                }
            }
            is RepositoryResult.NetworkError -> _error.value = R.string.error_no_network
            is RepositoryResult.UnknownError -> _error.value = R.string.error_unknown
        }
        _waiting.value = false
    }
}