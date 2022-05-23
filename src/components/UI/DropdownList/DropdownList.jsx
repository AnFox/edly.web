import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../ButtonBorder'
import { ArrowUp } from '../Icons/Icons'
import './DropdownList.scss'

const DropdownList = (props) => {
  DropdownList.propTypes = {
    selectedValue: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    array: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired
    })).isRequired
  }

  const [showList, setShowList] = useState(false)
  const onSelect = (data) => {
    props.onSelect(data)
    setShowList(false)
  }

  const eachOption = (data, i) => {
    return (
      <div key={i} onClick={() => onSelect(data)} className="option">{data.label}</div>
    )
  }
  const showOptions = () => props.array && props.array.map(eachOption)

  const show = () => {
    setShowList(true)
    document.querySelector('.dropdown_ui_button').focus()
  }

  const hide = () => {
    setShowList(false)
  }

  const onBlur = () => {
    setTimeout(hide, 100)
  }

  return (
    <div className="dropdown_ui">
      <Button onBlur={onBlur} className="dropdown_ui_button" onClick={showList ? hide : show} size="medium" >
        {props.selectedValue || ''}
        <ArrowUp className={`icon ${showList ? '' : 'icon_up'}`}/>
      </Button>
      <div tabIndex={7} className="dropdown_ui_list" style={{ height: showList ? `${document.getElementsByClassName('option')[0].clientHeight * props.array.length}px` : '0px' }}>
        {showOptions()}
      </div>
    </div>
  )
}

export default DropdownList
