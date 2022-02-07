package com.example.auth.ui.utils

import android.content.Context
import android.content.res.ColorStateList
import android.view.View
import androidx.core.content.ContextCompat

object StyleUtils {

    fun View.setBackgroundTint(context: Context, colorResId: Int) {
        val color = ContextCompat.getColor(context, colorResId)
        this.backgroundTintList = ColorStateList.valueOf(color)
    }
}