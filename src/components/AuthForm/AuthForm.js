import React, { useEffect, useState } from 'react'
import { animateScroll as scroll } from 'react-scroll'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { GoogleLogin } from 'react-google-login'
import { Link, useLocation, useHistory } from 'react-router-dom'
import './AuthForm.scss'
import '../CommonStyles/CommonStylesForm.scss'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import socialAuth from '../../services/SocialAuthService'
import Facebook from '../../assets/svg/Facebook.svg'
import Google from '../../assets/svg/Google.svg'
import { OAUTH_GOOGLE_ID } from '../../config'
import { authLogin } from '../../lib/auth/actions'
import { navigationSetIntendedUrl } from '../../lib/navigation/actions'
import { alertbarHide } from '../../lib/app/alertbar/actions'
import { getUser } from '../../lib/app/user/actions'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'

const AuthForm = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()
  const intendedUrl = useSelector(state => state.navigation.intendedUrl)

  useEffect(() => {
    if (location && location.state && location.state.from) {
      dispatch(navigationSetIntendedUrl(location.state.from.pathname))
    }
  }, [dispatch, location])

  const responseGoogleSuccess = (response) => {
    const token = response.accessToken
    if (token) {
      socialAuth.redirectTo(`${socialAuth.getCallbackUrl('google', 'login')}#access_token=${token}`)
    }
  }

  const responseGoogleFailure = (response) => {
    console.log('responseGoogleFailure', response)
  }

  const togglePasswordVisibility = () => {
    setIsPasswordShow((state) => !state)
  }

  const scrollToTop = () => {
    scroll.scrollToTop()
  }

  const onLoginSuccess = () => {
    dispatch(getUser())
    dispatch(alertbarHide())
    history.push(intendedUrl || '/rooms')
  }

  const formik = useFormik({
    initialValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Введите пароль'),
      emailOrPhone: Yup.string().required('Введите эл. почту или телефон')
        .test('min', 'Не менее 12 символов', val => val && val.match(/^\+/) ? val.toString().length > 11 : true)
        .test('max', 'Не более 16 символов', val => val && val.match(/^\+/) ? val.toString().length <= 16 : true)
        .test('international', 'Введите номер в международном формате', val => val && val.match(/^\+/) ? (val.match(/^\+\d{11}/g) || val.match(/^\+\d{15}/g)) : true)
        .test('email', 'Введите эл. почту или телефон в международном формате', val => val && !val.match(/^\+/)
          ? val.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
          : true),
      rememberMe: Yup.bool().required()
    }),
    onSubmit: (values) => {
      let data
      if (values.emailOrPhone.includes('@')) {
        data = {
          email: values.emailOrPhone,
          password: values.password,
          remember_me: true
        }
      } else {
        data = {
          phone: values.emailOrPhone,
          password: values.password,
          remember_me: true
        }
      }
      dispatch(authLogin(data, onLoginSuccess))
    }
  })

  return (
    <form className="auth_form" onSubmit={formik.handleSubmit}>
      <div className="title_auth auth_title_margin">Авторизация</div>
      <input
        name="emailOrPhone"
        type="text"
        className={`input_text ${formik.errors.emailOrPhone ? 'input_error' : ''}`}
        value={formik.values.emailOrPhone}
        placeholder="Эл. почта или телефон"
        onChange={formik.handleChange}
      />
      <div className="error_message">{formik.errors.emailOrPhone}</div>
      <div className="input_icon">
        <input
          name="password"
          type={(isPasswordShow) ? 'text' : 'password'}
          className={`input_text ${formik.errors.password ? 'input_error' : ''}`}
          placeholder="Пароль"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <div className={`input_eye_icon ${formik.errors.password ? 'input_error' : ''}`} onTouchStart={(e) => {
          e.preventDefault()
          togglePasswordVisibility()
        }} onTouchEnd={(e) => {
          e.preventDefault()
          togglePasswordVisibility()
        }} onMouseDown={togglePasswordVisibility} onMouseUp={togglePasswordVisibility}>
          {!isPasswordShow
            ? <Visibility style={{ width: '1em', height: '1em', backgroundColor: 'transparent', color: '#8F9BB3' }}/>
            : <VisibilityOff style={{ width: '1em', height: '1em', backgroundColor: 'transparent', color: '#8F9BB3' }}/>}
        </div>
      </div>
      {formik.errors.password
        ? <div style={{ marginBottom: '0' }} className="error_message">{formik.errors.password}</div>
        : <div className="label_bottom_info">Отправлен вам на почту при регистрации.</div>
      }
      <div>
        <FormControlLabel
          control={
            <Checkbox
              style={{ color: '#8F9BB3', backgroundColor: 'none' }}
              checked={formik.values.rememberMe}
              onChange={() => formik.setFieldValue('rememberMe', !formik.values.rememberMe)}
              name="checkedB"
              color="primary"
            />
          }
          label="Запомнить меня"
          className="input_chekbox auth_input_checbox_margin"
        />
      </div>
      <button type="submit"
        className="btn-primary auth_btn_margin"
        disabled={(!(formik.values.emailOrPhone && formik.values.password))}>
          Войти
      </button>
      <div className="label auth_label_one">Или войти как пользователь</div>
      <div className="authform_social_icons">
        <img src={Facebook} alt="Facebook" onClick={() => socialAuth.loginFacebook(true)}/>
        <GoogleLogin
          clientId={OAUTH_GOOGLE_ID}
          buttonText="Login"
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          isSignedIn={false}
          scope="email profile openid"
          render={renderProps => (
            <img
              src={Google}
              alt="Google"
              onClick={renderProps.onClick}
            />
          )}
        />
        {/* <img src={VK} alt="VK"/> */}
      </div>
      <div className="authform_line auth_line_margin"/>
      <div className="auth_margin_bottom"><Link className="href" to="/resetpass">Забыли пароль?</Link></div>
      <div className="label auth_label_two">Нет аккаунта? <Link className="href" to="/register">Зарегистрироваться</Link>
      </div>
      <div className="btn_up" onClick={scrollToTop}>
        <ExpandLessIcon/>
      </div>
    </form>
  )

}

export default AuthForm
