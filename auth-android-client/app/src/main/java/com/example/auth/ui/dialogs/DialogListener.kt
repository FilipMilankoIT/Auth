package com.example.auth.ui.dialogs

import android.os.Bundle

interface DialogListener {
    fun onDialogPositiveClick(tag : String, bundle: Bundle? = null)
    fun onDialogNegativeClick(tag : String, bundle: Bundle? = null)
    fun onDialogDismiss(tag : String, bundle: Bundle? = null)
}