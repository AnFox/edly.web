import React from 'react'
import { Check } from '../Icons/Icons'
import PropTypes from 'prop-types'
import './CheckBox.scss'

//  checked = boolean
//  onCheck = func
//  classNameLabel = стили для текста
//  label = текст

const CheckBox = (props) => {
  return (
    <label>
      <div className={`checkbox_ui_main ${props.className || ''}`}>
        <input style={{ display: 'none' }} ref={props.checkboxRef} defaultChecked={props.checked} type="checkbox" />
        <div onClick={props.onCheck} className={`checkbox_ui ${props.checked ? 'checkbox_ui_selected' : ''}`}>
          <Check />
        </div>
        {props.label ? <div className={`checkbox_ui_label ${props.checked ? 'checkbox_ui_label_selected' : ''} ${props.classNameLabel || ''}`}>{props.label}{props.children}</div> : null}
      </div>
    </label>
  )
}

CheckBox.propTypes = {
  className: PropTypes.string,
  checkboxRef: PropTypes.any,
  checked: PropTypes.bool,
  onCheck: PropTypes.func.isRequired,
  classNameLabel: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.instanceOf(Object)
}

export default CheckBox
