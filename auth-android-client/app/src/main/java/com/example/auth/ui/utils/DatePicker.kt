package com.example.auth.ui.utils

import com.google.android.material.datepicker.CalendarConstraints
import com.google.android.material.datepicker.DateValidatorPointBackward
import com.google.android.material.datepicker.MaterialDatePicker

object DatePicker {

    fun get(selectedTime: Long?) =
        MaterialDatePicker.Builder.datePicker()
            .setSelection(selectedTime ?: MaterialDatePicker.todayInUtcMilliseconds())
            .setCalendarConstraints(
                CalendarConstraints.Builder()
                    .setEnd(MaterialDatePicker.todayInUtcMilliseconds())
                    .setValidator(DateValidatorPointBackward.now())
                    .build()
            )
            .build()
}