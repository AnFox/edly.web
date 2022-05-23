import React from 'react'
import './input.scss'
import PropTypes from 'prop-types'

/*
className = className
classNameInput
titleText = text
title=boolean
showError = boolean
errorText = text
placeholder = placeholder
classNameBox = for box (input + icon)
colorMessage = blue, red
*/

const Input = (props) => {
  return (
    <div className={`input_ui_main ${props.className}`}>
      {props.title ? <div className="input_ui_title">{props.titleText}</div> : null}
      <div className={`input_ui_box ${props.classNameBox}`}>
        <input
          name={props.name}
          type={props.type}
          onClick={props.onClick}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          disabled={props.disabled}
          value={props.value}
          onChange={props.onChange}
          id={props.id}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          onKeyDown={props.onKeyDown}
          onKeyPress={props.onKeyPress}
          className={`input_ui_input input_ui_input_icon ${props.classNameInput}`}/>
        <div className="input_ui_icon"
          onTouchStart={props.onClickIcon}
          onClick={props.onClickIcon}
        >
          {props.icon()}
        </div>
      </div>
      {props.showError ? <div className={`input_ui_message input_ui_message_${props.colorMessage || 'red'}`}>{props.errorText}</div> : null}
    </div>

  )
}

Input.defaultProps = {
  className: '',
  classNameInput: '',
  id: null,
  name: null,
  placeholder: null,
  type: 'text',
  onClick: null,
  onBlur: null,
  onFocus: null,
  value: null,
  classNameBox: ''
}

Input.propTypes = {
  showError: PropTypes.bool,
  colorMessage: PropTypes.string,
  errorText: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.bool,
  titleText: PropTypes.string,
  icon: PropTypes.func,
  type: PropTypes.string,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onFocus: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  classNameInput: PropTypes.string,
  classNameBox: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyPress: PropTypes.func,
  onClickIcon: PropTypes.func
}

export default Input
