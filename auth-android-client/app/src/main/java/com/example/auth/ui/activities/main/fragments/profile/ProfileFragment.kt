package com.example.auth.ui.activities.main.fragments.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.example.auth.R
import com.example.auth.databinding.FragmentProfileBinding
import com.example.auth.ui.adapters.MySpinnerAdapter
import com.example.auth.ui.utils.DatePicker
import com.example.auth.utils.TimeUtils.toFormattedDate
import com.example.core.model.Gender
import com.google.android.material.snackbar.Snackbar
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ProfileFragment : Fragment(), AdapterView.OnItemSelectedListener {

    private val viewModel: ProfileViewModel by viewModels()

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.profile?.let {
            binding.username.setText(it.username)
            binding.firstName.setText(it.firstName)
            binding.lastName.setText(it.lastName)
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

        binding.saveButton.setOnClickListener {
            val firstName = binding.firstName.text.toString()
            val lastName = binding.lastName.text.toString()
            viewModel.save(firstName, lastName)
        }

        viewModel.profileUpdated.observe(viewLifecycleOwner) {
            if (it) {
                Snackbar.make(view, R.string.profile_updated_success, Snackbar.LENGTH_LONG).show()
            }
        }

        binding.signOutButton.setOnClickListener {
            viewModel.signOut()
        }

        binding.deleteButton.setOnClickListener {
            viewModel.deleteUser()
        }

        viewModel.userDeleted.observe(viewLifecycleOwner) {
            Toast.makeText(context, R.string.delete_user_success, Toast.LENGTH_LONG).show()
        }

        viewModel.error.observe(viewLifecycleOwner) {
            Snackbar.make(view, it, Snackbar.LENGTH_LONG).show()
        }

        viewModel.tokenError.observe(viewLifecycleOwner) {
            Toast.makeText(context, it, Toast.LENGTH_LONG).show()
        }

        viewModel.waiting.observe(viewLifecycleOwner) {
            val isEnabled = !it
            binding.firstName.isEnabled = isEnabled
            binding.lastName.isEnabled = isEnabled
            binding.birthday.isEnabled = isEnabled
            binding.gender.isEnabled = isEnabled
            binding.saveButton.isEnabled = isEnabled
            binding.signOutButton.isEnabled = isEnabled
            binding.deleteButton.isEnabled = isEnabled
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