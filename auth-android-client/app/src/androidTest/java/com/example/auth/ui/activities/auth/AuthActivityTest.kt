package com.example.auth.ui.activities.auth

import android.content.Context
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.*
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.platform.app.InstrumentationRegistry.getInstrumentation
import com.example.auth.R
import com.example.core.BuildConfig
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import java.util.*

@RunWith(AndroidJUnit4::class)
@LargeTest
class AuthActivityTest {

    @get:Rule
    val activityScenarioRule = ActivityScenarioRule(AuthActivity::class.java)

    @Before
    fun setUp() {
        val targetContext: Context = getInstrumentation().targetContext
        val sharedPref = targetContext.getSharedPreferences(BuildConfig.LIBRARY_PACKAGE_NAME,
            Context.MODE_PRIVATE)
        val tokenKey = "token"

        // Check if the user is already logged in.
        if (sharedPref.contains(tokenKey)) {
            // Logout
            onView(withId(R.id.navigation_profile)).perform(click())
            onView(withId(R.id.sign_out_button)).perform(click())
        }
    }

    @After
    fun cleanup() {
        activityScenarioRule.scenario.close()
    }

    @Test
    fun testLoginFragmentLayout() {
        onView(withId(R.id.username_label)).check(matches(withText(R.string.username_label)))
        onView(withId(R.id.username)).check(matches(withText("")))
        onView(withId(R.id.password_label)).check(matches(withText(R.string.password_label)))
        onView(withId(R.id.password)).check(matches(withText("")))
        onView(withId(R.id.register_question)).check(matches(withText(R.string.not_registered)))
        onView(withId(R.id.register_link)).check(matches(withText(R.string.create_an_account)))
        onView(withId(R.id.login_button)).check(matches(withText(R.string.sign_in_label)))
    }

    @Test
    fun testRegisterFragmentLayout() {
        onView(withId(R.id.register_link)).perform(click())
        onView(withId(R.id.username_label)).check(matches(withText(R.string.username_label)))
        onView(withId(R.id.username)).check(matches(withText("")))
        onView(withId(R.id.password_label)).check(matches(withText(R.string.password_label)))
        onView(withId(R.id.password)).check(matches(withText("")))
        onView(withId(R.id.confirm_password_label)).check(matches(withText(R.string.confirm_password_label)))
        onView(withId(R.id.confirm_password)).check(matches(withText("")))
        onView(withId(R.id.register_button)).check(matches(withText(R.string.sign_up_label)))
    }

    @Test
    fun testRegisterAndLoginFlow() {
        val username = UUID.randomUUID().toString()
        val password = "Pass123!"

        onView(withId(R.id.register_link)).perform(click())
        onView(withId(R.id.username)).perform(typeText(username))
        onView(withId(R.id.password)).perform(typeText(password))
        onView(withId(R.id.confirm_password)).perform(typeText(password))
        onView(isRoot()).perform(closeSoftKeyboard())
        onView(withId(R.id.register_button)).perform(click())

        Thread.sleep(5000)

        onView(withId(R.id.username)).perform(typeText(username))
        onView(withId(R.id.password)).perform(typeText(password))
        onView(isRoot()).perform(closeSoftKeyboard())
        onView(withId(R.id.login_button)).perform(click())

        Thread.sleep(5000)

        onView(withId(R.id.navigation_profile)).perform(click())
        onView(withId(R.id.username)).check(matches(withText(username)))
    }
}