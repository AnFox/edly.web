import React, { useState } from 'react'
import Button from '../UI/Button'
import ButtonBorder from '../UI/ButtonBorder'
import Input from '../UI/Input'
import PropTypes from 'prop-types'
import { CloseIcon } from '../UI/Icons/Icons'
import './PopupDeposit.scss'

/*  hide = func;
    accept = Оплатить, передается число.
*/

const text = {
  title: 'Пополнение баланса',
  subtitle: 'Укажите сумму на которую желаете пополнить',
  label: 'После подтверждения вы будете перенаправлены в платежную систему для дальнейшей оплаты',
  placeholder: '00.00 ₽',
  accept: 'Подтвердить',
  cost: 'Сумма',
  cancel: 'Отмена'
}
const PopupDeposit = (props) => {
  const [count, setCount] = useState()

  const setNumber = (e) => {
    if (e.target.value > 0) {
      setCount(e.target.value)
    } else {
      if (e.target.value === '') setCount(e.target.value)
    }
  }

  const hide = () => {
    props.hide()
  }

  const accept = () => {
    props.accept(count)
    props.hide()
  }

  return (
    <div className="popup_deposit_wrap">
      <div className="popup_deposit_window">
        <div className="popup_deposit_window_header">
          <div className="popup_deposit_window_title">{text.title}</div>
          <CloseIcon className="popup_deposit_window_close_icon" onClick={hide} />
        </div>
        <div className="popup_deposit_window_label popup_deposit_window_subtitle"><b>{text.subtitle}</b></div>
        <div className="popup_deposit_window_label">{text.label}</div>
        <Input type="number" className="popup_deposit_window_input_margin" title={true} titleText={text.cost} value={count} onChange={setNumber} classNameInput="popup_deposit_window_input" placeholder={text.placeholder} />
        <div className="popup_deposit_window_footer">
          <Button onClick={accept} disabled={!count} size="medium" label={text.accept}/>
          <ButtonBorder size="medium" onClick={hide} label={text.cancel}/>
        </div>
      </div>
    </div>
  )
}

PopupDeposit.propTypes = {
  hide: PropTypes.func,
  accept: PropTypes.func.isRequired
}

export default PopupDeposit
