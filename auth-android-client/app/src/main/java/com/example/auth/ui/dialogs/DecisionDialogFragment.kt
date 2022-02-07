package com.example.auth.ui.dialogs

import android.app.Dialog
import android.content.Context
import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import com.example.auth.databinding.DecisionDialogBinding

class DecisionDialogFragment : DialogFragment() {

    companion object {
        const val TAG = "DecisionDialogFragment"
    }

    private var _binding: DecisionDialogBinding? = null
    private val binding get() = _binding!!

    private var listener: DialogListener? = null

    override fun onAttach(context: Context) {
        super.onAttach(context)
        listener = parentFragment as? DialogListener ?: context as? DialogListener
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val dialog = Dialog(requireContext())
        _binding = DecisionDialogBinding.inflate(LayoutInflater.from(context))
        dialog.setContentView(binding.root)

        binding.negativeButton.setOnClickListener {
            listener?.onDialogNegativeClick(TAG)
            dialog.dismiss()
        }

        binding.positiveButton.setOnClickListener {
            listener?.onDialogPositiveClick(TAG)
            dialog.dismiss()
        }

        return dialog
    }

    fun show(childFragmentManager: FragmentManager) {
        show(childFragmentManager, TAG)
    }

    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)
        listener?.onDialogDismiss(TAG)
    }
}