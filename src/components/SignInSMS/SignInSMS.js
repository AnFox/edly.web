import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './SignInSMS.scss'
import '../CommonStyles/CommonStylesForm.scss'
import { Link } from 'react-router-dom'

const SignInSMS = (props) => {
  SignInSMS.propTypes = {
    enterRoom: PropTypes.func.isRequired,
  }

  const [pass, setPass] = useState(['', '', '', '', ''])

  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    testPass()
  }

  const testPass = () => {
    let password = pass.join('')
    let inputs = document.getElementsByClassName('input_text_sms')
    let err_label = document.getElementsByClassName('error_message')
    if (password !== '1234'){
      setError('Неверный код!')
      err_label[0].style.display = 'block'
      for (let i = 0; i<inputs.length; i++){
        inputs[i].classList.add('border_error')
      }
    } else {
      err_label[0].style.display = 'none'
      for (let i = 0; i<inputs.length; i++){
        inputs[i].classList.remove('border_error')
      }
      props.enterRoom()
    }
  }

  const updateInput = (event, index) => {
    let inputs = document.getElementsByClassName('input_text_sms')
    let temp = [...pass]
    temp[index] = event.target.value
    if (event.target.value === ''){
      inputs[(index-1) >= 0 ? (index-1) : (index)].focus()
    } else {
      inputs[(index+1) < inputs.length ? (index+1) : (index)].focus()
    }
    setPass(temp)
  }

  return (
    <form className="registration_form_options">
      <div className="title_auth title_margin">Проверка</div>
      <svg className="telephone_icon" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.8212 52.7495H24.5156C23.4801 52.7495 22.6406 53.589 22.6406 54.6245C22.6406 55.66 23.4801 56.4995 24.5156 56.4995H26.8212C27.8567 56.4995 28.6962 55.66 28.6962 54.6245C28.6962 53.589 27.8567 52.7495 26.8212 52.7495Z" fill="#00E096"/>
        <path d="M49.1236 0H34.3739C34.359 0 34.3445 0.000999982 34.3296 0.00112498C34.3295 0.00112498 34.3294 0.00112498 34.3291 0.00112498H11.1249C8.02333 0.00112498 5.5 2.52446 5.5 5.62603V58.3751C5.5 61.4767 8.02333 64 11.1249 64H39.8744C42.976 64 45.4993 61.4767 45.4993 58.3751V47.1273C45.4993 47.1264 45.4994 47.1257 45.4994 47.1249C45.4994 47.1242 45.4993 47.1233 45.4993 47.1225V25.0909H49.1237C54.293 25.0909 58.4986 20.8854 58.4986 15.7161V9.37484C58.4984 4.20555 54.293 0 49.1236 0V0ZM32.4064 34.885C32.6383 34.9811 32.882 35.0278 33.1235 35.0278C33.6114 35.0278 34.091 34.8371 34.4496 34.4785L41.7492 27.1789V45.2497H9.24981V11.6034H24.999V15.7161C24.999 19.7635 27.5479 23.2615 31.2489 24.5578V33.1528C31.2489 33.9112 31.7057 34.5949 32.4064 34.885ZM11.1249 3.75106H26.8784C25.9889 4.93354 25.3738 6.33276 25.1245 7.85349H9.24993V5.62603C9.24993 4.59217 10.091 3.75106 11.1249 3.75106ZM39.8743 60.2501H11.1248C10.0909 60.2501 9.24981 59.409 9.24981 58.3751V48.9999H41.7492V58.3751C41.7492 59.409 40.9083 60.2501 39.8743 60.2501ZM54.7485 15.7161C54.7485 18.8177 52.2253 21.341 49.1236 21.341H43.0607C42.5635 21.341 42.0865 21.5386 41.7349 21.8902L34.9987 28.6262V23.1103C34.9987 22.1946 34.3372 21.4129 33.4341 21.2613C30.7192 20.8055 28.7488 18.4734 28.7488 15.7161V9.37484C28.7488 6.27326 31.272 3.74993 34.3737 3.74993H49.1235C52.2252 3.74993 54.7484 6.27326 54.7484 9.37484V15.7161H54.7485Z" fill="#00E096"/>
        <path d="M34.375 10.6709C33.8812 10.6709 33.3986 10.8709 33.0487 11.2196C32.7 11.5684 32.5 12.0521 32.5 12.5459C32.5 13.0396 32.7 13.5221 33.0487 13.8709C33.3975 14.2196 33.8812 14.4209 34.375 14.4209C34.8688 14.4209 35.3512 14.2196 35.7011 13.8709C36.0499 13.5221 36.25 13.0384 36.25 12.5459C36.25 12.0521 36.0499 11.5684 35.7011 11.2196C35.3512 10.8709 34.8688 10.6709 34.375 10.6709Z" fill="#00E096"/>
        <path d="M41.875 10.6709C41.3812 10.6709 40.8975 10.8709 40.5487 11.2196C40.2 11.5684 40 12.0521 40 12.5459C40 13.0396 40.2 13.5221 40.5487 13.8709C40.8987 14.2209 41.3812 14.4209 41.875 14.4209C42.3688 14.4209 42.8512 14.2209 43.2011 13.8709C43.5499 13.5221 43.75 13.0384 43.75 12.5459C43.75 12.0521 43.5499 11.5684 43.2011 11.2196C42.8512 10.8709 42.3688 10.6709 41.875 10.6709Z" fill="#00E096"/>
        <path d="M49.375 10.6709C48.8812 10.6709 48.3986 10.8709 48.0487 11.2196C47.7 11.5684 47.5 12.0521 47.5 12.5459C47.5 13.0384 47.7 13.5221 48.0487 13.8709C48.3987 14.2209 48.8812 14.4209 49.375 14.4209C49.8688 14.4209 50.3512 14.2209 50.7011 13.8709C51.0499 13.5221 51.25 13.0384 51.25 12.5459C51.25 12.0521 51.0499 11.5684 50.7011 11.2196C50.3512 10.8709 49.8688 10.6709 49.375 10.6709Z" fill="#00E096"/>
      </svg>
      <div className="input_text_sms_flex">
        <input
          type="number"
          inputMode="numeric"
          className="input_text input_text_sms"
          placeholder="X"
          maxLength={1}
          onChange={(e) => updateInput(e, 0)}
        />
        <input
          type="number"
          inputMode="numeric"
          className="input_text input_text_sms"
          placeholder="X"
          maxLength={1}
          onChange={(e) => updateInput(e, 1)}
        />
        <input
          type="number"
          inputMode="numeric"
          className="input_text input_text_sms"
          placeholder="X"
          maxLength={1}
          onChange={(e) => updateInput(e, 2)}
        />
        <input
          type="number"
          inputMode="numeric"
          className="input_text input_text_sms"
          placeholder="X"
          maxLength={1}
          onChange={(e) => updateInput(e, 3)}
        />
      </div>
      <div style={{ display: 'none', marginLeft: '0', textAlign: 'center' }} className="error_message">{error}</div>
      <div className="label_bottom_info label_bottom_sms">Введите код из SMS отправленный <br />на указанный вами номер</div>
      <button type="submit"
        className="btn-primary register_button_option btn_sms_option"
        onClick={handleSubmit}
      >
          Войти
      </button>
      <div className="authform_line reg_line_margin" />
      <div className="label reg_label_four">Нет сообщения? <Link className="href" to="/login">Отправить повторно</Link></div>

    </form>
  )
}

export default SignInSMS
