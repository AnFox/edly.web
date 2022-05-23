import React, { useState } from 'react'
import './OverloadedEntryInWebinar.scss'
import PopUp from '../../UI/PopUp'
import Button from '../../UI/Button'
import { createAccountBalanceRefillOrder } from '../../../lib/app/orders/actions'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../../lib/app/user/actions'
import { hidePopUp } from '../../../lib/app/popUp/actions'

const OverloadedEntryInWebinar = () => {
  const dispatch = useDispatch()
  const [price, setPrice] = useState('')
  const user = useSelector(state => state.app.user)
  const popUp = useSelector(state => state.app.popUp)

  const setNumber = (e) => {
    if (e.target.value > 0) {
      setPrice(e.target.value)
    } else if (e.target.value === ''){
      setPrice(e.target.value)
    }
  }

  // useEffect(() => {
  //   dispatch(showPopUp('OverloadedEntryInWebinar_ONE'))
  // }, [])

  const addBalance = (amount) => {
    // Пополнить
    dispatch(createAccountBalanceRefillOrder(amount))
      .then((order) => {
        if (order) {
          const widget = new window.cp.CloudPayments()
          widget.charge(order,
            function () { // success
              //действие при успешной оплате
              dispatch(getUser())
              setShowPaymentPopUp('')
              dispatch(hidePopUp())
            },
            function (reason, options) { // fail
              //действие при неуспешной оплате
            })
        }
      })
  }
  const [showPaymentPopUp, setShowPaymentPopUp] = useState('')
  if (user.owner) {
    return (
      <>
        <PopUp closePopUp={() => dispatch(hidePopUp())} show={popUp && (popUp.type === 'OverloadedEntryInWebinar_ONE' || popUp.type === 'OverloadedEntryInWebinar_TWO')} >
          <div className={'overloaded_entry_pop_up'}>
            {(popUp && popUp.type === 'OverloadedEntryInWebinar_ONE') ? (
              <div className={'overloaded_entry_pop_up__header--one'}>Свободные места на вашем вебинаре скоро закончатся.</div>
            ) : (
              <>
                <div className={'overloaded_entry_pop_up__header--two'}>Места на вашем вебинаре закончились. </div>
                <div className={'overloaded_entry_pop_up__label'}>К вам хотят войти на вебинар посетители, но к сожалению не могут.</div>
              </>
            )}

            <Button className={'overloaded_entry_pop_up__btn'} onClick={() => setShowPaymentPopUp('popUpPayment')}>ПОПОЛНИТЬ СЧЁТ</Button>
          </div>
        </PopUp>
        <PopUp closePopUp={() => setShowPaymentPopUp('')} show={showPaymentPopUp === 'popUpPayment'} className={'popup_ui_window--overloaded_pop_up_payment'}>
          <div className={'overloaded_pop_up_payment'}>
            {user.account && user.account.cards && user.account.cards[0] && user.account.cards[0].last_four ? (
              <div className={'overloaded_pop_up_payment__opp_header'}>{`Ваша карта **** ${user.account.cards[0].last_four}`}</div>
            ) : null}

            <div className={'overloaded_pop_up_payment__payment_options_list payment_options_list'}>
              <Button
                color={'yellow'}
                className={price === '300' ? '' : 'payment_options_list__btn--off'}
                onClick={() => setPrice('300')}
              >
                +300
              </Button>
              <Button
                color={'yellow'}
                className={price === '500' ? '' : 'payment_options_list__btn--off'}
                onClick={() => setPrice('500')}
              >
                +500
              </Button>
              <Button
                color={'yellow'}
                className={price === '1000' ? '' : 'payment_options_list__btn--off'}
                onClick={() => setPrice('1000')}
              >
                +1000
              </Button>
              <div className={'payment_options_list__input_box'}>
                <span>Другая сумма</span>
                <input className={''} value={price} onChange={setNumber} />
              </div>

            </div>
            <Button disabled={!price} onClick={() => addBalance(price)}>ОПЛАТИТЬ</Button>
          </div>
        </PopUp>
      </>
    )
  } else {
    return null
  }

}

export default OverloadedEntryInWebinar
