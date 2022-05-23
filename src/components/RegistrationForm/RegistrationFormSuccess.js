import React, { useCallback, useEffect, useState } from 'react'
import Mail from '../../assets/svg/Mail_Icon.svg'
import { useHistory } from 'react-router-dom'
import './RegistrationForm.scss'
import '../CommonStyles/CommonStylesForm.scss'
import Button from '../UI/Button'
import { RefreshOneArrow } from '../UI/Icons/Icons'
import { useSelector, useDispatch } from 'react-redux'
import { getUser, requestEmailVerificationCode } from '../../lib/app/user/actions'
import PropTypes from 'prop-types'
import { alertbarShow } from '../../lib/app/alertbar/actions'
import { authLogout } from '../../lib/auth/actions'

const RegistrationFormSuccess = (props) => {
  const history = useHistory()
  const user = useSelector(state => state.app.user)
  const dispatch = useDispatch()
  const [time, setTime] = useState(0)

  const handleSubmit = () => {
    dispatch(authLogout())
    history.push('/')
  }

  const timer = useCallback(() => {
    setTime((time) => {
      if (time > 0) {
        localStorage.setItem('timer', JSON.stringify({ timer: time - 1 }))
        setTimeout(timer, 1000)
        return time - 1
      } else {
        return time
      }

    })
  }, [])

  useEffect(() => {
    if (user.email_verified_at) {
      history.push('/')
    }
  }, [history, props, user])

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem('timer'))
    if (res) {
      if (res.timer < 60) {
        setTime(res.timer)
        timer()
      }
    } else {
      localStorage.setItem('timer', JSON.stringify({ timer: 60 }))
    }
  }, [timer])

  const sendRepeat = () => {
    dispatch(requestEmailVerificationCode()).then(() => {
      dispatch(alertbarShow({
        type: 'info',
        messages: ['Код подтверждения выслан на Ваш email.']
      }))
      setTime(60)
      timer()
    })
  }

  const refresh = () => {
    if (user.id) {
      dispatch(getUser())
    }
  }

  return (
    <form className="registration_form_options">
      <div className="title_auth title_success_options">Регистрация</div>
      <img src={Mail} alt="mail" className="image_success_options" />
      <div className="label label_one_success_option"><strong>Ссылка для завершения регистрации отправлена!</strong></div>
      <div className="label label_two_success_option">Проверьте электронную почту.<br />Если письма нет, поищите в папке со спамом.</div>
      <Button
        size="big"
        onClick={handleSubmit}
      >
        На главную страницу
      </Button>
      <div className="registration_form_line" />
      <a className={`registration_form_link ${time > 0 ? 'disabled' : ''}`} href="#" onClick={time === 0 ? sendRepeat : null}>Отправить повторно</a>
      {time > 0 &&
      <div className="registration_form_success_repeat_form">
        <div className="registration_form_success_repeat_form_label">Переотправить можно через {time} секунд</div>
        <div className="registration_form_success_repeat_form_refresh" onClick={refresh}>
          <RefreshOneArrow/>
          <span>Обновить статус</span>
        </div>
      </div>
      }

    </form>
  )
}

RegistrationFormSuccess.propTypes = {
  nextStep: PropTypes.func
}

export default RegistrationFormSuccess
