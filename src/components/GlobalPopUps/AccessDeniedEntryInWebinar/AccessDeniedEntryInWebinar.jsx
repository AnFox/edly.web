import React from 'react'
import './AccessDeniedEntryInWebinar.scss'
import PopUp from '../../UI/PopUp'
import Button from '../../UI/Button'
import { useDispatch, useSelector } from 'react-redux'
import { hidePopUp } from '../../../lib/app/popUp/actions'

const text = {
  popUp: {
    title: 'К сожалению, ',
    labelPrimary: 'вы собираетесь посетить вебинар, на котором количество мест ограничено.',
    labelSecondary: 'Мы уже оповестили организатора об этом.',
    labelTertiary: 'Повторите попытку входа через несколько минут.',
    btnOk: 'OK'
  }
}

const AccessDeniedEntryInWebinar = () => {
  const dispatch = useDispatch()
  const popUp = useSelector(state => state.app.popUp)
  return (
    <PopUp
      show={popUp && popUp.type === 'AccessDeniedEntryInWebinar'}
      showButtonCancel={false}
      showButtonAccept={false}
      closePopUp={() => dispatch(hidePopUp())}
    >
      <div className={'enter_allowed_pop_up'}>
        <span className={'enter_allowed_pop_up__label'}>{text.popUp.title}</span>
        <span className={'enter_allowed_pop_up__label--bold'}>{text.popUp.labelPrimary}</span>
        <span className={'enter_allowed_pop_up__label'}>{text.popUp.labelSecondary}</span>
        <span className={'enter_allowed_pop_up__label--bold'}>{text.popUp.labelTertiary}</span>
        <Button size={'big'} onClick={() => dispatch(hidePopUp())}>{text.popUp.btnOk}</Button>
      </div>
    </PopUp>
  )
}

export default AccessDeniedEntryInWebinar
