import React from 'react'
import { Link } from 'react-router-dom'
import './CheckPayment.scss'
import Button from '../UI/Button'
import { CircleFailed, CirclePending, CircleSuccess } from '../UI/Icons/Icons'
import PropTypes from "prop-types"
import { createAccountBalanceRefillOrder } from '../../lib/app/orders/actions'
import { useDispatch } from 'react-redux'

const text = {
  title: 'Статус оплаты',
  success: 'Платеж прошел успешно',
  pending: 'В ожидании платежа',
  failed: 'Платеж не прошел',
  sum: 'Сумма:',
  item: 'руб.',
  buttonSuccess: 'Создать комнату',
  buttonPending: 'Обновить страницу',
  buttonFailed: 'Повторить оплату'
}

const CheckPayment = (props) => {


  const { status, amount, order_id, description, fail_message } = props.payment

  const dispatch = useDispatch()

  const repeatPayment = (amount) => {
    dispatch(createAccountBalanceRefillOrder(amount))
      .then((order) => {
        if (order) {
          const widget = new window.cp.CloudPayments()
          widget.charge(order,
            function (options) { // success
              //действие при успешной оплате
              window.location.reload()
            },
            function (reason, options) { // fail
              //действие при неуспешной оплате
            })
        }
      })
  }

  const refreshPage = () => document.location.reload()
  const createRoom = () => document.getElementById('linkToRooms').click()

  let textForButton = status === 'succeeded' ? text.buttonSuccess : status === 'pending' ? text.buttonPending : text.buttonFailed
  const funcOnButton = () => status === 'succeeded' ? createRoom() : status === 'pending' ? refreshPage() : repeatPayment()
  return(
    <div className="check_payment_wrap">
      <div className="check_payment">
        <div className="check_payment_title">{text.title}</div>
        {status === 'succeeded' ? <><CircleSuccess className="check_payment_icon" /><div className="check_payment_label"><b>{text.success}</b></div></> : null}
        {status === 'pending' ? <><CirclePending className="check_payment_icon" /><div className="check_payment_label"><b>{text.pending}</b></div></> : null}
        {status === 'failed' ? <><CircleFailed className="check_payment_icon" /><div className="check_payment_label"><b>{`${text.failed}: ${fail_message}`}</b></div></> : null}
        <div className="check_payment_label">{description} (№ {order_id})</div>
        <div className="check_payment_line" />
        <div><span style={{ fontWeight: '600' }}>{text.sum}</span> <b>{amount} {text.item}</b></div>
        <Button onClick={funcOnButton} size="big" color="blue" label={textForButton} />
        <Link to="/rooms" id="linkToRooms" style={{ display: 'none' }} />
      </div>
    </div>
  )
}

CheckPayment.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    order_id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    paid: PropTypes.bool.isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    fail_message: PropTypes.string.isRequired
  }).isRequired,
}

export default CheckPayment
