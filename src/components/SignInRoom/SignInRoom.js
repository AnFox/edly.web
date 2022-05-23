import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { animateScroll as scroll } from 'react-scroll'
import { Checkbox } from '@material-ui/core'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { Link } from 'react-router-dom'
import './SignInRoom.scss'
import '../CommonStyles/CommonStylesForm.scss'

const SignInRoom = (props) => {
  SignInRoom.propTypes = {
    enterRoom: PropTypes.func.isRequired
  }
  const [nameState, setName] = useState('')
  const leadNameState = 'Иван'
  const [accesPrivateData, setAcces] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    testData()
    // this.props.authLogin({email: username, password, remember_me: true});
  }
  const [date, setDate] = useState(new Date())
  useEffect(() => {
    setInterval(() => setDate(new Date()), 1000)
  }, [])

  const dateStart = new Date('04.06.20')
  const testData = () => {
    let access = true
    const input = document.getElementsByClassName('input_text')
    if (nameState.length < 2) {
      setError('Введите ваше имя')
      input[0].classList.add('input_error')
      access = false
    } else {
      setError('')
      input[0].classList.remove('input_error')
    }
    if (access) {
      props.enterRoom()
    }
  }

  return (
    <form className="sign_in_room_form" >
      <div className="title_auth sign_in_room_title_margin">{'Название комнаты'}</div>
      <div className="label title_left title_lead ">Ведущие вебинара: <strong>{leadNameState}</strong></div>
      <div className="label title_left">Дата проведения: <strong>{date.toLocaleDateString()} - {date.toLocaleTimeString().substr(0, 5)}</strong> мск</div>
      <div className="label title_left title_data">Начало через <strong>{Math.trunc(((date - dateStart) / (1000 * 60 * 60 * 24)) * -1)}</strong> дн.</div>
      <input
        type="text"
        className="input_text"
        placeholder="Ваше имя"
        value={nameState}
        required
        onChange={(e) => setName(e.target.value)}
      />
      <div className="error_message">{error}</div>
      <div className="sign_in_room_checkbox_grid sign_in_room_margin">
        <div className="sign_in_room_checkbox_margin">
          <Checkbox
            style={{ color: '#8F9BB3', backgroundColor: 'none', padding: '0' }}
            checked={accesPrivateData}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            onChange={() => setAcces(!accesPrivateData)}
            name="checkedB"
            color="primary"
          />
        </div>

        <div className="label">Заполняя эту форму, вы соглашаетесь на обработку <Link className="href" to="/privacy">персональных данных.</Link></div>

      </div>
      <button type="submit"
        className="btn-primary"
        onClick={handleSubmit}
        disabled={nameState === ''}>
          Войти
      </button>
      <div className="authform_line margin_line" />
      <Link className="href" to="/login">Вход для модераторов</Link>
      <div className="btn_up btn_up_mobile" onClick={() => scroll.scrollToTop()}>
        <ExpandLessIcon />
      </div>
    </form>
  )
}

export default SignInRoom
