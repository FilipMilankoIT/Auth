package com.example.core.model

enum class Gender(val value: String) {
    MALE("male"),
    FEMALE("female"),
    OTHER("other");

    companion object {
        fun from(value: String?): Gender? {
            return when(value) {
                MALE.value -> MALE
                FEMALE.value -> FEMALE
                OTHER.value -> OTHER
                else -> null
            }
        }
    }
}