package com.example.core.storage

import android.content.Context
import android.util.Log
import com.google.gson.Gson
import java.lang.reflect.Type

internal class SharedPrefsDataProvider(
    val context: Context,
    val name: String,
    private val gson: Gson) :
    DataProvider {

    companion object {
        private const val TAG = "SharedPrefsDataProvider"
    }

    private val preferences = context.getSharedPreferences(name, Context.MODE_PRIVATE)

    override fun <T> readValue(key: String, type: Type): T? {
        val string = preferences.getString(key, null)

        var value: T? = null
        if (string != null) {
            try {
                value = gson.fromJson(string, type)
            } catch (e: Exception) {
                Log.d(TAG, "readValue: ", e)
            }
        }
        return value
    }

    override fun <T> writeValue(key: String, value: T) {
        preferences.edit().remove(key).putString(key, gson.toJson(value)).apply()
    }

    override fun remove(key: String) {
        preferences.edit().remove(key).apply()
    }

    override fun clear() {
        preferences.edit().clear().apply()
    }
}