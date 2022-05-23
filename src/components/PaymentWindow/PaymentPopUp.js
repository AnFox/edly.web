import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../CommonStyles/CommonStylesChat.scss'

const PaymentPopUp = (props) => {
  PaymentPopUp.propTypes = {
    open: PropTypes.bool,
    setOpenPayment: PropTypes.func,
    bannerId: PropTypes.any,
  }
  const [dateCard, setDateCard] = useState('')
  const [cvvCard, setCvvCard] = useState('')
  const [namePayment, setNamePayment] = useState('')
  const [numberCard, setNumberCard] = useState('')
  const [emailPayment, setEmailPayment] = useState('')
  const [error, setError] = useState(['', '', '', '', ''])

  const testData = () => {
    let temp = [...error]
    let input = document.getElementsByClassName('payment_input')
    let flag = true
    if (emailPayment.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/i)){
      input[4].classList.remove('input_error')
      temp[4] = ''
    } else {
      temp[4] = 'Неверный формат почты'
      input[4].classList.add('input_error')
      flag = false
    }
    if (numberCard.match(/[0-9]{16}/)){
      input[0].classList.remove('input_error')
      temp[0] = ''
    } else {
      temp[0] = 'Неверно введены данные'
      input[0].classList.add('input_error')
      flag = false
    }
    if(namePayment !== ''){
      temp[3] = ''
      input[3].classList.remove('input_error')
    } else {
      temp[3] = 'Введите имя'
      input[3].classList.add('input_error')
      flag = false
    }
    if((cvvCard !== '') && (cvvCard.length > 2)){
      input[2].classList.remove('input_error')
      temp[2] = ''
    } else {
      temp[2] = 'Ошибка'
      input[2].classList.add('input_error')
      flag = false
    }
    if(dateCard.match(/[0-1]+[0-9]+\/+[2-9]+[2-9]/)){
      input[1].classList.remove('input_error')
      temp[1] = ''
    } else {
      temp[1] = 'Ошибка'
      input[1].classList.add('input_error')
      flag = false
    }

    setError(temp)

    if(flag){
      sendCard()
    }
  }
  const sendCard = () => {
    // кнопка Оплатить
    setDateCard('')
    setCvvCard('')
    setNumberCard('')
    setEmailPayment('')
    setDateCard('')
    props.setOpenPayment(false)
  }
  return (
    <div className="fon_payment" style={{ display: `${props.open ? 'flex' : 'none'}` }}>
      <div className="payment_wrap" onClick={() => props.setOpenPayment(false)}/>
      <div className="payment_window">
        <div className="payment_window_flex">
          <svg className="close_setting_icon" onClick={() => props.setOpenPayment(false)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="close_setting_icon_path" d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z" fill="#222B45"/>
          </svg>
        </div>
        <div className="payment_window_padding">
          <div className="payment_window_header">
            <div className="title_flex">
                        Оплата банковской картой
            </div>
          </div>
          <input className="input_text payment_input" value={numberCard} onChange={(e) => setNumberCard(e.target.value)} maxLength={16} placeholder="Номер карты" />
          <div className="error_input">{error[0]}</div>
          <div className="payment_input_flex">
            <div>
              <input className="input_text payment_input payment_input_small" value={dateCard} onChange={(e) => setDateCard(e.target.value)} placeholder="ММ/ГГ" />
              <div className="error_input">{error[1]}</div>
            </div>
            <div>
              <input className="input_text payment_input payment_input_small" value={cvvCard} onChange={(e) => setCvvCard(e.target.value)} placeholder="CVV" maxLength={3} />
              <div className="error_input">{error[2]}</div>
            </div>
          </div>
          <input className="input_text payment_input" maxLength={100} value={namePayment} onChange={(e) => setNamePayment(e.target.value)} placeholder="Имя держателя карты" />
          <div className="error_input">{error[3]}</div>
          <input className="input_text payment_input" required={'Заполните поле'} maxLength={100} value={emailPayment} onChange={(e) => setEmailPayment(e.target.value)} placeholder="Эл. почта" />
          <div className="error_input">{error[4]}</div>
          <button className="payment_button" onClick={() => testData()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C4.20435 5 3.44129 5.31607 2.87868 5.87868C2.31607 6.44129 2 7.20435 2 8V16C2 16.7956 2.31607 17.5587 2.87868 18.1213C3.44129 18.6839 4.20435 19 5 19H19C19.7956 19 20.5587 18.6839 21.1213 18.1213C21.6839 17.5587 22 16.7956 22 16V8C22 7.20435 21.6839 6.44129 21.1213 5.87868C20.5587 5.31607 19.7956 5 19 5ZM4 8C4 7.73478 4.10536 7.48043 4.29289 7.29289C4.48043 7.10536 4.73478 7 5 7H19C19.2652 7 19.5196 7.10536 19.7071 7.29289C19.8946 7.48043 20 7.73478 20 8V9H4V8ZM20 16C20 16.2652 19.8946 16.5196 19.7071 16.7071C19.5196 16.8946 19.2652 17 19 17H5C4.73478 17 4.48043 16.8946 4.29289 16.7071C4.10536 16.5196 4 16.2652 4 16V11H20V16Z" fill="white"/>
              <path d="M7 15H11C11.2652 15 11.5196 14.8946 11.7071 14.7071C11.8946 14.5196 12 14.2652 12 14C12 13.7348 11.8946 13.4804 11.7071 13.2929C11.5196 13.1054 11.2652 13 11 13H7C6.73478 13 6.48043 13.1054 6.29289 13.2929C6.10536 13.4804 6 13.7348 6 14C6 14.2652 6.10536 14.5196 6.29289 14.7071C6.48043 14.8946 6.73478 15 7 15Z" fill="white"/>
              <path d="M15 15H17C17.2652 15 17.5196 14.8946 17.7071 14.7071C17.8946 14.5196 18 14.2652 18 14C18 13.7348 17.8946 13.4804 17.7071 13.2929C17.5196 13.1054 17.2652 13 17 13H15C14.7348 13 14.4804 13.1054 14.2929 13.2929C14.1054 13.4804 14 13.7348 14 14C14 14.2652 14.1054 14.5196 14.2929 14.7071C14.4804 14.8946 14.7348 15 15 15Z" fill="white"/>
            </svg>
                    &nbsp;Оплатить
          </button>
        </div>

      </div>
    </div>
  )
}

export default PaymentPopUp
