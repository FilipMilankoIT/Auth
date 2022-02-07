package com.example.auth.utils

import java.text.SimpleDateFormat
import java.util.*

object TimeUtils {

    fun Long.toFormattedDate(): String {
        val formatter = SimpleDateFormat("dd.MM.yyyy", Locale.getDefault())
        formatter.timeZone = TimeZone.getTimeZone("UTC")
        return formatter.format(Date(this))
    }
}