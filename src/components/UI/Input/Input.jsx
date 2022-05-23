import React, { useState } from 'react'
import { Eye, EyeClose } from '../Icons/Icons'
import PropTypes from 'prop-types'
import './input.scss'

/*
className = className
classNameInput
titleText = text
title=boolan
showError = boolean
errorText = text
placeholder = placeholder
classNameBox = for box (input + icon)
colorMessage = blue, red
*/

const Input = (props) => {
  const [visibility, setVisibility] = useState(false)
  const { title, classNameInput, showError, titleText, classNameBox, refInput, errorText, colorMessage, ...rest } = props

  return (
    <div className={`input_ui_main ${props.className}`}>
      {title ? <div className="input_ui_title">{titleText}</div> : null}
      {!props.icon ? (
        props.refBool ? (
          <div><input
            ref={props.refInput}
            type={props.type}
            onClick={props.onClick}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            disabled={props.disabled}
            defaultValue={props.value}
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            className={`input_ui_input ${classNameInput || ''}`}/>
          </div>
        ) : (<div><input
          { ...rest }
          className={`input_ui_input ${classNameInput}`}/>
        </div>)
      ) : (
        <div className={`input_ui_box ${classNameBox}`}>
          <input
            type={visibility ? 'text' : 'password'}
            onClick={props.onClick}
            onBlur={props.onBlur}
            disabled={props.disabled}
            value={props.value}
            onChange={props.onChange}
            onKeyPress={props.onKeyPress}
            id={props.id}
            autoComplete={'new-password'}
            name={props.name}
            placeholder={props.placeholder}
            className={`input_ui_input input_ui_input_icon ${props.classNameInput}`}/>
          <div className="input_ui_icon"
            onTouchStart={(e) => { e.preventDefault(); setVisibility(!visibility) }}
            onTouchEnd={(e) => { e.preventDefault(); setVisibility(!visibility) }}
            onMouseDown={() => setVisibility(!visibility)}
            onMouseUp={() => setVisibility(!visibility)}
          >
            {!visibility ? <Eye /> : <EyeClose />}
          </div>
        </div>
      )
      }
      {props.showError ? <div className={`input_ui_message input_ui_message_${props.colorMessage || 'red'}`}>{props.errorText}</div> : null}
    </div>
  )
}

Input.defaultProps = {
  className: '',
  classNameInput: '',
  classNameBox: '',
  id: null,
  name: null,
  placeholder: null,
  refInput: null,
  type: 'text',
  onClick: null,
  onBlur: null,
  onFocus: null,
  value: null
}

Input.propTypes = {
  showError: PropTypes.bool,
  colorMessage: PropTypes.string,
  errorText: PropTypes.string,
  refBool: PropTypes.bool,
  refInput: PropTypes.shape({ current: PropTypes.any }),
  className: PropTypes.string,
  title: PropTypes.bool,
  titleText: PropTypes.string,
  icon: PropTypes.bool,
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
  tabIndex: PropTypes.number
}

export default Input
