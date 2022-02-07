package com.example.core.di

import android.content.Context
import com.computerrock.hotmix.core.di.GsonProvider.gson
import com.example.core.BuildConfig
import com.example.core.repository.Repository
import com.example.core.repository.RepositoryImpl
import com.example.core.storage.DataProvider
import com.example.core.storage.SharedPrefsDataProvider
import com.example.api.AuthApi
import com.example.api.di.ApiProvider
import com.google.gson.Gson

object CoreProvider {

    @Volatile private var api: AuthApi? = null
    @Volatile private var dataProvider: DataProvider? = null

    fun getRepository(context: Context, baseUrl: String): Repository {
        return RepositoryImpl(getAuthApi(baseUrl), getDataProvider(context))
    }

    private fun getAuthApi(baseUrl: String): AuthApi =
        api ?: synchronized(this) {
            api ?: ApiProvider.getAuthApi(baseUrl)
                .also { api = it }
        }

    private fun getDataProvider(context: Context): DataProvider =
        dataProvider ?: synchronized(this) {
            dataProvider ?:
            SharedPrefsDataProvider(context, BuildConfig.LIBRARY_PACKAGE_NAME, gson)
                .also { dataProvider = it}
        }
}