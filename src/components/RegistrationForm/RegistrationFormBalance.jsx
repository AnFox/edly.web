import React, { useState } from 'react'
import Button from '../UI/Button'
import { Link, useHistory } from 'react-router-dom'
import Cards from '../../assets/img/Cards.jpg'
import { createAccountBalanceRefillOrder } from '../../lib/app/orders/actions'
import { useDispatch } from 'react-redux'
import PaymentWindow from '../PopupPutInDeposit'

const RegistrationFormBalance = () => {
  const [openPayment, setOpenPayment] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  const addBalance = (amount) => {
    // Пополнить
    dispatch(createAccountBalanceRefillOrder(amount))
      .then((order) => {
        if (order) {
          const widget = new window.cp.CloudPayments()
          widget.charge(order,
            function (options) { // success
              //действие при успешной оплате
              localStorage.removeItem('balance')
              history.push('/')
            },
            function (reason, options) { // fail
              //действие при неуспешной оплате
            })
        }
      })
  }

  const endRegistration = () => {
    localStorage.removeItem('registration')
    localStorage.removeItem('balance')
  }

  return (
    <div className="registration_form_options">
      <div className="title_auth title_margin">Спецпредложение</div>
      <img className="registration_form_balance_img" src={Cards} alt="" />
      <div className="registration_form_subtitle_linking">Привяжите карту и пополните баланс минимум на 300 <span className="monetary_unit">₽</span> в течении суток, а мы удвоим ваш счет</div>
      <Button
        size="big"
        onClick={() => setOpenPayment(true)}
        color="yellow"
      >
        Пополнить баланс
      </Button>
      <div className="registration_form_line" />
      <Link className="registration_form_link" to={'/'} onClick={endRegistration} >Попробовать бесплатно</Link>
      {openPayment && <PaymentWindow hide={() => setOpenPayment(false)} accept={addBalance} />}
    </div>
  )
}

export default RegistrationFormBalance
