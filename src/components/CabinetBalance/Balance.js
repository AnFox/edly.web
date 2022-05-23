import React, { useState } from 'react'
import './Balance.scss'
import Button from '../UI/Button'
import ButtonBorder from '../UI/ButtonBorder'
import PaymentWindow from '../PopupPutInDeposit'
import { Basket, CloseIcon } from '../UI/Icons/Icons'
import { useDispatch, useSelector } from "react-redux"
import { createAccountBalanceRefillOrder } from "../../lib/app/orders/actions"
import { deleteAccountCard } from "../../lib/app/user/actions"
import Visa from '../../assets/svg/cards/Visa.svg'
import Maestro from '../../assets/svg/cards/Maestro.svg'
import Mir from '../../assets/svg/cards/MIR.svg'
import MasterCard from '../../assets/svg/cards/MasterCard.svg'

const text = {
  subtitleBalance: 'Баланс',
  subtitleCards: 'Платежная карта',
  label: 'Функциональность аккаунта ограничена! Чтобы создавать комнаты, пополните счет на 600 руб.',
  button: 'Пополнить',
  unit: 'руб.',
  popUp: {
    title: 'Подтвердите',
    subtitle: 'Вы собираетесь удалить карту',
    label: 'После удаления, функциональность вашего аккаунта будет ограничена, вы не сможете создавать новые комнаты.',
    buttonDelete: 'Удалить',
    cancel: 'Отмена'
  }
}

const Balance = () => {
  const balance = useSelector(state => state.app.user.account.balance)
  const cards = useSelector(state => state.app.user.account.cards)
  const [openPopup, setOpenPopup] = useState(false)
  const [openPayment, setOpenPayment] = useState(false)
  const [idCard, setIdCard] = useState()
  const user = useSelector(state => state.app.user)
  const dispatch = useDispatch()
  const addBalance = (amount) => {
    // Пополнить
    dispatch(createAccountBalanceRefillOrder(amount))
      .then((order) => {
        if (order) {
          const widget = new window.cp.CloudPayments()
          widget.charge(order,
            function (options) { // success
              //действие при успешной оплате
              setOpenPayment(false)
            },
            function (reason, options) { // fail
              //действие при неуспешной оплате
            })
        }
      })
  }

  const deleteCard = () => {
    // idCard
    setIdCard()
    dispatch(deleteAccountCard())
    setOpenPopup(false)
  }
  const getIcon = (type) => {
    switch(type){
    case 'Visa': return Visa
    case 'MasterCard': return MasterCard
    case 'МИР': return Mir
    case 'Maestro': return Maestro
    default: return null
    }
  }
  const eachCard = (data, key) => {
    return(
      <React.Fragment key={key}>
        <div className="card_single">
          <div className='card_single_icon' style={{ backgroundImage: `url(${getIcon(data.type)})` }}/>
          <div>**** **** **** {data.last_four}</div>
          <Basket onClick={() => { setIdCard(data.last_four); setOpenPopup(true) }} />
        </div>
      </React.Fragment>
    )
  }
  const showCards = () => cards.map(eachCard)
  return(
    <div className="balance">
      {openPayment ? <PaymentWindow hide={() => setOpenPayment(false)} accept={addBalance} /> : null}
      <div className="balance_subtitle">{text.subtitleBalance}</div>
      <div className="balance_flex">
        <div className="balance_deck" style={{ color: balance > 0 ? '#00E096' : '#FF3D71' }}>{balance}&nbsp;{text.unit}</div>
        {(user.account && user.email_verified_at) &&
        <Button onClick={() => setOpenPayment(true)} size="medium" color="green" label={text.button} />}
      </div>
      {balance > 0 ? null : <div className="balance_label">{text.label}</div>}
      {cards && (
        <>
          <div className="balance_subtitle">{text.subtitleCards}</div>
          <div className="cards_list">
            {showCards()}
          </div>
        </>
      )}

      {openPopup
        ? <div className="delete_card_wrap">
          <div className="delete_card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="delete_card_title">{text.popUp.title}</div>
              <CloseIcon onClick={() => setOpenPopup(false)} classname="delete_card_close_icon" />
            </div>
            <div className="delete_card_label"><b>{text.popUp.subtitle}<span> **** **** **** {cards.find((data) => { return data.last_four === idCard }).last_four}</span></b></div>
            <div className="delete_card_label">{text.popUp.label}</div>
            <div className="delete_card_buttons">
              <Button onClick={deleteCard} size="medium" color="red" label={text.popUp.buttonDelete} />
              <ButtonBorder onClick={() => setOpenPopup(false)} size="medium" color="blue" label={text.popUp.cancel} />
            </div>
          </div>
        </div> : null}
    </div>
  )
}

export default Balance
