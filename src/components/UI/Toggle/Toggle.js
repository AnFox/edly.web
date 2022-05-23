import React from 'react'
import PropTypes from 'prop-types'
import './Toggle.scss'

// label = подпись, справа
// selected = boolean
// classList = для кастомизации

const Toggle = (props) => {
  return (
    <div className={`toggle_ui_main ${props.classList}`}>
      <input style={{ display: 'none' }} type="checkbox" id={props.id} name={props.name} onChange={props.onChange} defaultChecked={props.selected}/>
      <label className={`toggle_ui_box ${props.selected ? 'toggle_ui_box_selected' : ''}`} htmlFor={props.id} onClick={props.onSelect}>
        <div className="toggle_ui_circle" />
      </label>
      {props.label ? <div className="toggle_ui_label">{props.label}</div> : null}
    </div>
  )
}

Toggle.defaultProps = {
  id: '',
  classList: '',
  name: '',
  onChange: null,
  onSelect: null
}

Toggle.propTypes = {
  classList: PropTypes.string,
  selected: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.string
}

export default Toggle
