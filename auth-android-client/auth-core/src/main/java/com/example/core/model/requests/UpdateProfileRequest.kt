package com.example.core.model.requests

import androidx.annotation.Keep
import com.example.core.model.Profile

@Keep
data class UpdateProfileRequest(val profile: Profile)