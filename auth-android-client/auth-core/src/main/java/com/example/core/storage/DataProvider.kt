package com.example.core.storage

import java.lang.reflect.Type

interface DataProvider {
    fun <T> readValue(key: String, type: Type): T?
    fun <T> writeValue(key: String, value: T)
    fun remove(key: String)
    fun clear()
}