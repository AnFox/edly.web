import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import './CodeVerification.scss'
import '../CommonStyles/CommonStylesForm.scss'
import { Phone } from '../UI/Icons/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUser, requestPhoneVerificationCode, submitPhoneVerificationCode } from '../../lib/app/user/actions'
import { alertbarHide, alertbarShow } from '../../lib/app/alertbar/actions'
import { useHistory } from 'react-router-dom'
import webSocket from '../../services/WebSocketService'

const CodeVerification = (props) => {
  const initialStateDigits = ['', '', '', '']
  const [digits, setDigits] = useState(initialStateDigits)
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector(state => state.app.user)

  useEffect(() => {
    dispatch(getUser()).then(() => {
      if (user.id) {
        webSocket.init()
        webSocket.wsSubscribePrivateChannel(user.id)
      }

      if(user.phone_verified_at) {
        dispatch(alertbarHide())
      }
    })
  }, [dispatch, history, user.id, user.phone_verified_at])

  useEffect(() => {
    // Destroy websocket on componentWillUnmount
    return () => webSocket.destroy()
  }, [])

  useEffect(() => {
    if (user && user.phone_verified_at) {
      props.callback && props.callback()
    }
  }, [props, user])

  const onSuccess = useCallback(() => {
    dispatch(alertbarHide())
  }, [dispatch])

  const onFail = (e) => {
    // console.log('Phone verification failed', e);
  }

  useEffect(() => {
    const doc = document.getElementsByClassName('input_text_sms')
    doc[0].focus()
  }, [])



  const handleSubmit = useCallback((e) => {
    if (e) {
      e.preventDefault()
    }
    const code = digits.join('')
    setDigits(initialStateDigits)
    dispatch(submitPhoneVerificationCode({ code }))
      .then(() => {
        onSuccess()
        props.callback && props.callback()
      })
      .catch((e) => {
        document.getElementsByClassName('input_text_sms')[0].focus()
        onFail(e)
      })
  }, [digits, dispatch, initialStateDigits, onSuccess])

  const updateInput = async (event, index) => {
    const inputs = document.getElementsByClassName('input_text_sms')
    const temp = [...digits]
    temp[index] = event.target.value.length < 2 ? event.target.value : temp[index]
    if (event.target.value === '') {
      inputs[(index - 1) >= 0 ? (index - 1) : (index)].focus()
    } else {
      inputs[(index + 1) < inputs.length ? (index + 1) : (index)].focus()
    }
    setDigits(temp)
  }

  useEffect(() => {
    if (digits[3] !== '') {
      handleSubmit()
    }
  }, [digits, handleSubmit])

  const handleCodeRequest = () => {
    dispatch(requestPhoneVerificationCode())
      .then(() => {
        dispatch(alertbarShow({
          type: 'info',
          messages: ['?????? ?????????????????????????? ???????????? ???? ?????? ??????????????.']
        }))
      })
  }

  return (
    <form className="registration_form_options">
      <div className="title_auth title_margin">?????????????????????? ??????????????</div>
      <Phone className="telephone_icon"/>
      <div className="input_text_sms_flex">
        <input
          type="number"
          inputMode="numeric"
          className="input_text input_text_sms"
          placeholder="X"
          maxLength={1}
          value={digits[0]}
          onChange={(e) => updateInput(e, 0)}
        />
        <input
          type="number"
          inputMode="numeric"
          className="input_text input_text_sms"
          placeholder="X"
          maxLength={1}
          value={digits[1]}
          onChange={(e) => updateInput(e, 1)}
        />
        <input
          type="number"
          inputMode="numeric"
          className="input_text input_text_sms"
          placeholder="X"
          maxLength={1}
          value={digits[2]}
          onChange={(e) => updateInput(e, 2)}
        />
        <input
          type="number"
          inputMode="numeric"
          className="input_text input_text_sms"
          placeholder="X"
          maxLength={1}
          value={digits[3]}
          onChange={(e) => updateInput(e, 3)}
        />
      </div>
      <div className="label_bottom_info label_bottom_sms">?????????????? ?????? ???? SMS ???????????????????????? <br/>???? ?????????????????? ???????? ??????????
      </div>
      <button type="submit"
        className="btn-primary register_button_option btn_sms_option"
        onClick={handleSubmit}
      >
        ??????????????????????
      </button>
      <div className="authform_line reg_line_margin"/>
      <div className="label reg_label_four">
        ?????? ??????????????????? <a className="href" href="#" onClick={handleCodeRequest}>?????????????????? ????????????????</a>
      </div>
    </form>
  )
}

CodeVerification.propTypes = {
  callback: PropTypes.func
}

export default CodeVerification
