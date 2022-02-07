package com.example.auth.ui.adapters

import android.content.Context
import android.graphics.Typeface
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.core.content.ContextCompat
import com.example.auth.R

class MySpinnerAdapter(context: Context, layout: Int, items: Array<String>)
    : ArrayAdapter<String>(context, layout, items) {

    override fun isEnabled(position: Int): Boolean {
        return position != 0
    }

    override fun getDropDownView(
        position: Int,
        convertView: View?,
        parent: ViewGroup
    ): View {
        val view: TextView = super.getDropDownView(position, convertView, parent) as TextView
        if (position == 0) {
            view.setTypeface(null, Typeface.BOLD)
        } else {
            view.setTypeface(null, Typeface.NORMAL)
        }
        return view
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view: TextView = super.getView(position, convertView, parent) as TextView
        if (position == 0) {
            view.setTextColor(ContextCompat.getColor(context, R.color.hint))
        } else {
            view.setTextColor(ContextCompat.getColor(context, R.color.text))
        }
        return view
    }

}