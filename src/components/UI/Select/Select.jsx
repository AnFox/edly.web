import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './Select.scss'
import { ArrowDown } from '../Icons/Icons'
/*
  value: string
  onChange: func
  className
  title = title, string
  list = array of arguments, {value, label}
*/

const Select = (props) => {
  const [isShowList, setIsShowList] = useState(false)

  const setValue = (e, option) => {
    e.stopPropagation()
    setIsShowList(false)
    props.onChange(option)
  }

  const eachOption = (option, i) => {
    return (
      <div key={i} onClick={(e) => setValue(e, option)}>{option.label}</div>
    )
  }

  const changeShowList = (e) => {
    if (!isShowList) {
      e.currentTarget.focus()
    }
    setIsShowList(!isShowList)
  }

  const showList = () => props.list.map(eachOption)

  return (
    <div className="select_ui_box">
      {props.title && <div className="select_ui_title">{props.title}</div>}
      <div tabIndex={76} className={`select_ui${props.className ? ' ' + props.className : ''}`} onClick={changeShowList} onBlur={() => setIsShowList(false)}>
        <span className="select_ui_value">{props.value || 'Не выбрано'}</span>
        <ArrowDown className="select_ui_icon" style={{ transform: isShowList ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0deg)' }} />
        <div className="select_ui_list" style={{ height: isShowList ? `${props.list.length * 48}px` : '0' }}>
          {!!props.list.length && showList()}
        </div>
      </div>
    </div>

  )
}

Select.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any
  })).isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
}

export default Select
