import React from 'react'
import './Button.scss'
import PropTypes from 'prop-types'

/*
size = размер, варианты: big, medium, small
color: blue, green, red, yellow
className = className
onClick = onClick
label = text button
*/
const Button = (props) => {
  return (
    <button onClick={props.onClick} disabled={props.disabled} type={props.type || null} className={`btn_ui btn_ui_${props.size || 'big'} btn_ui_${props.color || 'blue'} ${props.className ? props.className : ''}`}>
      {props.children}
      {props.label}
    </button>
  )
}

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string
}

export default Button
