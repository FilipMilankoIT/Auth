package com.example.auth.dagger

import android.content.Context
import com.example.auth.BuildConfig
import com.example.core.di.CoreProvider
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
class AppModule {

    @Singleton
    @Provides
    fun provideRepository(@ApplicationContext context: Context) =
        CoreProvider.getRepository(context, BuildConfig.AUTH_API_HOST)
}