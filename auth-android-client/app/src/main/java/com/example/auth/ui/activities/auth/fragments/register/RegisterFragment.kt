package com.example.auth.ui.activities.auth.fragments.register

import android.os.Bundle
import android.text.method.HideReturnsTransformationMethod
import android.text.method.PasswordTransformationMethod
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.example.auth.R
import com.example.auth.databinding.FragmentRegisterBinding
import com.example.auth.ui.adapters.MySpinnerAdapter
import com.example.auth.ui.utils.DatePicker
import com.example.auth.ui.utils.StyleUtils.setBackgroundTint
import com.example.auth.utils.TimeUtils.toFormattedDate
import com.example.core.model.Gender
import com.google.android.material.snackbar.Snackbar
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class RegisterFragment : Fragment(), AdapterView.OnItemSelectedListener {

    private val viewModel : RegisterViewModel by viewModels()

    private var _binding: FragmentRegisterBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View {
        _binding = FragmentRegisterBinding.inflate(inflater, container, false)
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

        binding.confirmPasswordShowIcon.setOnClickListener {
            viewModel.toggleConfirmPasswordVisibility()
        }

        viewModel.isConfirmPasswordShown.observe(viewLifecycleOwner) {
            if (it == true) {
                binding.confirmPassword.transformationMethod =
                    HideReturnsTransformationMethod.getInstance()
                binding.confirmPasswordShowIcon.setBackgroundTint(requireContext(),
                    R.color.show_icon_selected)
            } else {
                binding.confirmPassword.transformationMethod =
                    PasswordTransformationMethod.getInstance()
                binding.confirmPasswordShowIcon.setBackgroundTint(requireContext(),
                    R.color.show_icon_default)
            }
        }

        binding.registerButton.setOnClickListener {
            val username = binding.username.text.toString()
            val password = binding.password.text.toString()
            val confirmPassword = binding.confirmPassword.text.toString()
            val firstName = binding.firstName.text.toString()
            val lastName = binding.lastName.text.toString()

           viewModel.submit(username, password, confirmPassword, firstName, lastName)
        }

        viewModel.isUserRegistered.observe(viewLifecycleOwner) {
            if(it) {
                Snackbar.make(view, R.string.register_success, Snackbar.LENGTH_LONG).show()
                findNavController().popBackStack()
            }
        }

        viewModel.usernameError.observe(viewLifecycleOwner) {
            binding.username.error = if (it != null) getString(it) else null
        }

        viewModel.passwordError.observe(viewLifecycleOwner) {
            binding.password.error = if (it != null) getString(it) else null
        }

        viewModel.confirmPasswordError.observe(viewLifecycleOwner) {
            binding.confirmPassword.error = if (it != null) getString(it) else null
        }

        binding.birthday.setOnClickListener {
            val datePicker = DatePicker.get(viewModel.birthday.value)
            datePicker.addOnPositiveButtonClickListener {
                if (it != null) {
                    viewModel.setBirthday(it)
                }
            }

            datePicker.show(childFragmentManager, "DatePicker")
        }

        viewModel.birthday.observe(viewLifecycleOwner) {
            if (it != null) {
                binding.birthday.setText(it.toFormattedDate())
            }
        }

        binding.gender.adapter = MySpinnerAdapter(
            requireContext(),
            R.layout.spinner_item,
            resources.getStringArray(R.array.genders_array)
        )
        binding.gender.onItemSelectedListener = this

        viewModel.gender.observe(viewLifecycleOwner) {
            val position = when(it) {
                Gender.MALE -> 1
                Gender.FEMALE -> 2
                Gender.OTHER -> 3
                else -> 0
            }
            binding.gender.setSelection(position)
        }

        viewModel.error.observe(viewLifecycleOwner) {
            Snackbar.make(view, it, Snackbar.LENGTH_LONG).show()
        }

        viewModel.waiting.observe(viewLifecycleOwner) {
            val isEnabled =!it
            binding.username.isEnabled = isEnabled
            binding.password.isEnabled = isEnabled
            binding.confirmPassword.isEnabled = isEnabled
            binding.firstName.isEnabled = isEnabled
            binding.lastName.isEnabled = isEnabled
            binding.birthday.isEnabled = isEnabled
            binding.gender.isEnabled = isEnabled
            binding.registerButton.isEnabled = isEnabled
            binding.loader.visibility = if (isEnabled) View.GONE else View.VISIBLE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, pos: Int, id: Long) {
        when(pos) {
            1 -> Gender.MALE
            2 -> Gender.FEMALE
            3 -> Gender.OTHER
            else -> null
        }?.let {
            viewModel.setGender(it)
        }
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {

    }
}