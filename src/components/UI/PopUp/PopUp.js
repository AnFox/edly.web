import React, { useEffect } from 'react'
import { CloseIcon } from '../Icons/Icons'
import './PopUp.scss'
import Button from '../Button'
import ButtonBorder from '../ButtonBorder'
import PropTypes from 'prop-types'

/*
компонент контроллируемый, ф-ии открытия/закрытия и bool статус нужно передавать извне;
закрывается на Esc;

show = bool, открыто/закрыто окно
closePopUp = ф-ия закрытия окна.

className = свой стиль окна
disableScroll = bool, запретить скроллить страницу, по умолчанию false
title = string, если необходим заголовок

showButtonAccept -
showButtonCancel - bool, показать кнопки

buttonAcceptType
buttonCancelType - типы кнопок, варианты: "fill", "border"

buttonAcceptSize
buttonCancelSize - размер кнопок, см. в Button.js

buttonAcceptColor -
buttonCancelColor - цвета кнопок

buttonAcceptLabel -
buttonCancelLabel - текст кнопок

onAccept -
onCancel - ф-ии, срабатывающие при нажатии на кнопки.
*/
const PopUp = (props) => {
  useEffect(() => {
    const hidePopUp = (e) => {
      if (e.keyCode === 27) {
        props.closePopUp(false)
      }
    }

    window.addEventListener('keydown', hidePopUp)
    return () => window.removeEventListener('keydown', hidePopUp)
  }, [props])

  useEffect(() => {
    const body = document.querySelector('body')
    if (props.show && props.disableScroll) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = 'auto'
    }
    return () => {
      const body = document.querySelector('body')
      if (body) {
        body.style.overflow = 'auto'
      }
    }
  }, [props.disableScroll, props.show])

  const getButtonAccept = (type) => {
    switch (type) {
    case 'fill':
      return <Button disabled={props.ButtonAcceptDisabled}
        size={props.buttonAcceptSize}
        color={props.buttonAcceptColor}
        onClick={props.onAccept}
        label={props.buttonAcceptLabel}/>
    case 'border':
      return <ButtonBorder disabled={props.ButtonAcceptDisabled}
        size={props.buttonAcceptSize}
        color={props.buttonAcceptColor}
        onClick={props.onAccept}
        label={props.buttonAcceptLabel}/>
    default:
      return <Button disabled={props.ButtonAcceptDisabled}
        size={props.buttonAcceptSize}
        color={props.buttonAcceptColor}
        onClick={props.onAccept}
        label={props.buttonAcceptLabel}/>
    }
  }
  const getButtonCancel = (type) => {
    switch (type) {
    case 'fill':
      return <Button size={props.buttonCancelSize}
        color={props.buttonCancelColor}
        onClick={props.onCancel}
        label={props.buttonCancelLabel}/>
    case 'border':
      return <ButtonBorder size={props.buttonCancelSize}
        color={props.buttonCancelColor}
        onClick={props.onCancel}
        label={props.buttonCancelLabel}/>
    default:
      return <Button size={props.buttonCancelSize}
        color={props.buttonCancelColor}
        onClick={props.onCancel}
        label={props.buttonCancelLabel}/>
    }
  }
  return (
    <div className="popup_ui_wrap" id="popup_ui"
      style={{ display: `${props.show ? 'flex' : 'none'}` }}>
      <div className={`popup_ui_window ${props.className}`}>
        <CloseIcon className="popup_ui_close_icon"
          onClick={() => props.closePopUp(false)}/>
        {props.title ? <div
          className="popup_ui_window_title">{props.title}</div> : null}
        {props.children}
        {(props.showButtonAccept || props.showButtonCancel) &&
          <div className="popup_ui_window_buttons_list">
            {props.showButtonAccept
              ? getButtonAccept(props.buttonAcceptType)
              : null}
            {props.showButtonCancel
              ? getButtonCancel(props.buttonCancelType)
              : null}
          </div>}
      </div>
    </div>
  )
}

PopUp.defaultProps = {
  buttonAcceptType: 'fill',
  buttonCancelType: 'border',
  buttonAcceptSize: 'medium',
  buttonCancelSize: 'medium',
  buttonCancelColor: 'blue',
  buttonAcceptColor: 'blue',
  className: ''
}

PopUp.propTypes = {
  show: PropTypes.bool,
  showButtonAccept: PropTypes.bool,
  showButtonCancel: PropTypes.bool,
  ButtonAcceptDisabled: PropTypes.bool,
  disableScroll: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  buttonAcceptType: PropTypes.string,
  buttonCancelType: PropTypes.string,
  buttonAcceptSize: PropTypes.string,
  buttonCancelSize: PropTypes.string,
  buttonAcceptColor: PropTypes.string,
  buttonCancelColor: PropTypes.string,
  buttonAcceptLabel: PropTypes.string,
  buttonCancelLabel: PropTypes.string,
  onAccept: PropTypes.func,
  onCancel: PropTypes.func,
  closePopUp: PropTypes.func.isRequired,
  children: PropTypes.any
}

export default PopUp
