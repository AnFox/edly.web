import React from 'react'
import PropTypes from 'prop-types'
import './Button.scss'

/*
size = размер, варианты: big, medium, small
color: blue, green, red
className = className
onClick = onClick
label = text button
*/
const Button = (props) => {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`btn_ui_border btn_ui_border_${props.size} btn_ui_border_${props.color} ${props.className}`}
    >
      <span>
        {props.children}
        {props.label}
      </span>
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node
}

Button.defaultProps = {
  children: undefined,
  size: 'big',
  color: 'blue',
  className: ''
}

export default Button
