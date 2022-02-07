package com.example.auth.ui.activities.auth

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.navigation.findNavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import com.example.auth.R
import com.example.auth.databinding.ActivityAuthBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class AuthActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAuthBinding

    private var appBarConfiguration : AppBarConfiguration? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()

        super.onCreate(savedInstanceState)
        binding = ActivityAuthBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.appBar.toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        val host: NavHostFragment = supportFragmentManager
            .findFragmentById(R.id.my_nav_host_fragment) as NavHostFragment? ?: return

        val navController = host.navController

        appBarConfiguration = AppBarConfiguration(navController.graph)

        appBarConfiguration?.let {
            setupActionBarWithNavController(navController, it)
        }

        navController.addOnDestinationChangedListener { _, destination, _ ->
            when (destination.id) {
                R.id.navigation_sign_in -> R.string.app_name
                R.id.navigation_sign_up -> R.string.registration_title
                else -> null
            }?.let {
                binding.appBar.title.setText(
                    it
                )
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        appBarConfiguration?.let {
            return findNavController(R.id.my_nav_host_fragment).navigateUp()
        }
        return super.onSupportNavigateUp()
    }
}