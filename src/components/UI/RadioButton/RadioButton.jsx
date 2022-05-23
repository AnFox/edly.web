import React, { useState } from 'react'
import './RadioButton.scss'
import PropTypes from 'prop-types'

//  controll = для управления извне
//  selected = bull
//  onSelect = func
//  classNameLabel = стили для текста
//  label = текст

const RadioButton = (props) => {
  const [check, setCheck] = useState(false)
  return(
    <div className={`radio_button_ui ${props.className || ''}`}>
      {props.controll ? (
        <>
          <div className="radio_button_ui_box" onClick={props.onSelect}>
            <div className={`radio_button_ui_circle ${props.selected ? 'radio_button_ui_circle_selected_border' : ''}`}>
              <div className={`radio_button_ui_circle_inside ${props.selected ? 'radio_button_ui_circle_selected' : ''}`} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="radio_button_ui_box" onClick={() => setCheck(!check)}>
            <div className={`radio_button_ui_circle ${check ? 'radio_button_ui_circle_selected_border' : ''}`}>
              <div className={`radio_button_ui_circle_inside ${check ? 'radio_button_ui_circle_selected' : ''}`} />
            </div>
          </div>
        </>
      )}

      {props.label ? <div className={`radio_button_ui_label ${props.classNameLabel || ''}`}>{props.label}</div> : null}
    </div>
  )
}

RadioButton.propTypes = {
  className: PropTypes.string,
  classNameLabel: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  controll: PropTypes.bool
}

export default RadioButton
