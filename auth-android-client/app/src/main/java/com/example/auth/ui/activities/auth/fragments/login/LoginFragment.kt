package com.example.auth.ui.activities.auth.fragments.login

import android.content.Intent
import android.os.Bundle
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.example.auth.R
import com.example.auth.databinding.FragmentLoginBinding
import com.example.auth.ui.activities.main.MainActivity
import com.example.auth.ui.utils.StyleUtils.setBackgroundTint
import com.google.android.material.snackbar.Snackbar
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class LoginFragment : Fragment() {

    private val viewModel : LoginViewModel by viewModels()

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        binding.passwordShowIcon.setOnClickListener {
            viewModel.togglePasswordVisibility()
        }

        viewModel.isPasswordShown.observe(viewLifecycleOwner) {
            if (it == true) {
                binding.password.transformationMethod =
                    HideReturnsTransformationMethod.getInstance()
                binding.passwordShowIcon.setBackgroundTint(requireContext(),
                    R.color.show_icon_selected)
            } else {
                binding.password.transformationMethod =
                    PasswordTransformationMethod.getInstance()
                binding.passwordShowIcon.setBackgroundTint(requireContext(),
                    R.color.show_icon_default)
            }
        }

        binding.loginButton.setOnClickListener {
            val username = binding.username.text.toString()
            val password = binding.password.text.toString()
            viewModel.submit(username, password)
        }

        viewModel.isUserLoggedIn.observe(viewLifecycleOwner) {
            if (it) {
                startActivity(Intent(context, MainActivity::class.java))
                requireActivity().finish()
            }
        }

        binding.registerLink.setOnClickListener {
            findNavController().navigate(R.id.action_login_to_register)
        }

        viewModel.usernameError.observe(viewLifecycleOwner) {
            binding.username.error = if (it != null) getString(it) else null
        }

        viewModel.passwordError.observe(viewLifecycleOwner) {
            binding.password.error = if (it != null) getString(it) else null
        }

        viewModel.error.observe(viewLifecycleOwner) {
            Snackbar.make(view, it, Snackbar.LENGTH_LONG).show()
        }

        viewModel.waiting.observe(viewLifecycleOwner) {
            val isEnabled =!it
            binding.username.isEnabled = isEnabled
            binding.password.isEnabled = isEnabled
            binding.loginButton.isEnabled = isEnabled
            binding.registerLink.isEnabled = isEnabled
            binding.loader.visibility = if (isEnabled) View.GONE else View.VISIBLE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}