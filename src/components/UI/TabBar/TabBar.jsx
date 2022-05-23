import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { CloseIcon } from '../Icons/Icons'
import './TabBar.scss'

const TabBar = (props) => {
  const { setMenuOption, menuOption } = props
  const mouse = useRef({})

  useEffect(() => {
    const mouseUp = () => {
      mouse.current = { ...mouse.current, down: false }
    }
    window.addEventListener('mouseup', mouseUp)
    return () => window.removeEventListener('mouseup', mouseUp)
  }, [])

  const moveAt = (event) => {
    let menu = document.getElementById('nav_menu')
    let container = document.querySelector(`.tab_bar_ui`)

    if (mouse.current.down) {
      const left = event.pageX - mouse.current.shiftX
      if ((container.offsetWidth - menu.offsetWidth) < left + 20 && left < 0) {
        menu.style.left = left + 'px'
      }

    }
  }

  const onMouseDown = (event) => {
    const e = event.type === 'touchstart' ? event.touches[0] || event.changedTouches[0] : event
    let menu = document.getElementById('nav_menu')
    mouse.current = { ...mouse.current, down: true }
    mouse.current = { ...mouse.current, shiftX: e.clientX - menu.getBoundingClientRect().left }
    if (event.type !== 'touchstart') {
      event.preventDefault()
    }

    event.stopPropagation()
  }

  const onMouseMove = (event) => {
    const e = event.type === 'touchmove' ? event.touches[0] || event.changedTouches[0] : event
    moveAt(e)
  }

  const eachTab = (tab, i) => {
    const value = props.values[i] || ''
    return (
      <div
        key={i}
        onClick={() => setMenuOption(value)}
        className={`menu_item ${menuOption === value
          ? 'menu_item_selected'
          : ''}`}>
        {tab}
      </div>
    )
  }

  return (
    <div className={'tab_bar_ui ' + props.className || ''}>
      <div
        id="nav_menu"
        onMouseDownCapture={onMouseDown}
        onMouseMove={onMouseMove}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
      >
        {React.Children.toArray(props.children).map(eachTab)}
      </div>
      {props.closeIcon && <div className="tab_bar_ui_icon_options">
        <CloseIcon className={'tab_bar_ui_icon_options__icon'} onClick={() => props.onClose(false)} />
      </div>}
    </div>
  )
}

TabBar.defaultProps = {
  className: ''
}

TabBar.propTypes = {
  setMenuOption: PropTypes.func.isRequired,
  menuOption: PropTypes.string.isRequired,
  showSetting: PropTypes.func,
  optionWindow: PropTypes.string,
  closeIcon: PropTypes.bool,
  children: PropTypes.any,
  onClose: PropTypes.func,
  className: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
}

export default TabBar
