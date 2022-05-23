import React, { useState, useEffect } from 'react'
import './RegFormInWebinar.scss'
import Input from '../UI/Input'
import Button from '../UI/Button'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Telegram, WhatsApp, Viber } from '../UI/Icons/Icons'
import { authLogin, authRegister, getWebinarInfoFromIntendedUrl } from '../../lib/auth/actions'
import { navigationSetIntendedUrl } from '../../lib/navigation/actions'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Footer from '../Footer'
import CheckBox from '../UI/CheckBox'
import BackgroundImage from '../../assets/img/register-webinar-background-logo-default.png'
import { getWebinarVisitor } from '../../lib/app/webinar/actions'
import { showPopUp } from '../../lib/app/popUp/actions'

const text = {
  dateStart: 'Время проведения',
  duration: 'Продолжительность',
  buttonSuccess: 'Записаться',
  buttonHasAccount: 'Уже есть аккаунт',
  buttonRegister: 'Регистрация',
  placeholderNotRegisteredEmail: 'Эл. почта',
  placeholderNotRegisteredPhone: 'Телефон',
  placeholderSigInLogin: 'Эл. почта или телефон',
  placeholderSigInPassword: 'Пароль',
}

const RegFormInWebinar = () => {
  const [successTermsOfUse, setSuccessTermsOfUse] = useState(false)
  const [successOnlyAcc, setSuccessOnlyAcc] = useState(false)
  const dispatch = useDispatch()
  const params = useParams()
  const history = useHistory()
  const webinar = useSelector(state => state.app.webinar.webinarPublic[params.roomId])
  const [typeUrl, setTypeUrl] = useState('')
  const isAuthenticated = useSelector(state => state.auth.tokens)
  const navigation = useSelector(state => state.navigation.intendedUrl)
  const [isRegister, setIsRegister] = useState(false)


  useEffect(() => {
    if (params.roomId) {
      const url = `/webinar/${params.roomId}${params.webinarSlug ? '/' + params.webinarSlug : ''}`
      dispatch(navigationSetIntendedUrl(url))
      dispatch(getWebinarInfoFromIntendedUrl(params.roomId, url))
      // if (+webinar.room_id !== +params.roomId) {
      //   dispatch(getWebinarInfoFromIntendedUrl(params.roomId, url))
      // }
    }
  }, [dispatch, params])

  // useEffect(() => {
  //   return () => {
  //     dispatch(webinarPublicClear({ roomId: params.roomId }))
  //   }
  // }, [])


  const signUp = (url) => {
    dispatch(getWebinarVisitor(webinar.id)).then(res => {
      if (res.payload.enter_allowed === false && !(res.payload.moderatable || res.payload.adminable)) {
        dispatch(showPopUp('AccessDeniedEntryInWebinar'))
      } else {
        window.gtag('event', 'registration', {
          event_category: 'webinars',
          event_label: `${webinar.id}/${webinar.slug}`
        })
        history.push(`/webinar/${webinar.room_id}/${webinar.slug}`)
        if (url && typeof url === 'string') {
          window.open(getUrl(url), '_blank')
        }
      }
    })

  }

  const onSubmitIsLogin = (values) => {
    let data = {
      remember_me: true,
      password: values.pass
    }
    if (values.login.includes('@')) {
      data = {
        ...data,
        email: values.login,
      }
    } else {
      data = {
        ...data,
        phone: values.login,
      }
    }
    dispatch(authLogin(data, () => signUp(typeUrl)))
  }

  const onSubmitIsNotLogin = (values) => {
    dispatch(authRegister({
      email: values.email,
      phone: values.phone,
      successTermsOfUse: successTermsOfUse,
      successOnlyAcc: successOnlyAcc,
      intendedUrl: navigation
    }, () => signUp(typeUrl)))
  }

  const getUrl = (url) => {
    switch (url) {
    case 'telegram':
      return webinar.bot_url_telegram
    case 'whatsapp':
      return webinar.bot_url_whatsapp
    case 'viber':
      return webinar.bot_url_viber
    default:
      return ''
    }
  }

  const formikIsNotLogin = useFormik({
    initialValues: {
      email: '',
      phone: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email введён неверно')
        .trim()
        .required('Введите Email'),
      phone: Yup.string()
        .required('Введите номер телефона')
        .test('min', 'Не менее 12 символов', val => val && val.toString().length > 11)
        .test('min', 'Не более 16 символов', val => val && val.toString().length <= 16)
        .test('international', 'Введите номер в международном формате', val => val ? ((val.match(/^\+\d{11}/g) || !val.match(/^8/)) || val.match(/^\+\d{15}/g)) : true)
    }),
    onSubmit: values => {
      onSubmitIsNotLogin(values)
    }
  })

  const formikIsLogin = useFormik({
    initialValues: {
      login: '',
      pass: ''
    },
    validationSchema: Yup.object({
      login: Yup.string().required('Введите Email или телефон')
        .test('min', 'Не менее 12 символов', val => val && val.match(/^\+/) ? val.toString().length > 11 : true)
        .test('max', 'Не более 16 символов', val => val && val.match(/^\+/) ? val.toString().length <= 16 : true)
        .test('international', 'Введите номер в международном формате', val => val && val.match(/^\+/) ? (val.match(/^\+\d{11}/g) || val.match(/^\+\d{15}/g)) : true)
        .test('email', 'Введите эл. почту или телефон', val => val && !val.match(/^\+/)
          ? val.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
          : true),
      pass: Yup.string()
        .min(6, 'Не менее 6 символов')
        .required('Введите пароль')
    }),
    onSubmit: values => {
      onSubmitIsLogin(values)
    }
  })

  const getBackgroundImage = () => {
    return webinar?.thumbnail || BackgroundImage
  }

  const getDuration = () => {
    const hours = (webinar.duration_minutes / 60).toFixed()
    const minutes = webinar.duration_minutes -
    (Math.trunc(webinar.duration_minutes / 60) * 60) < 10
      ? `0${webinar.duration_minutes -
      (Math.trunc(webinar.duration_minutes / 60) * 60)}`
      : webinar.duration_minutes - (Math.trunc(webinar.duration_minutes / 60) * 60)
    return (
      <span style={{ color: '#0095FF' }}>{hours < 1 ? '' : `${hours} ч.`} {minutes} мин.</span>
    )
  }

  const getDateStart = () => <span style={{ color: '#0095FF' }}>{webinar.starts_at ? (new Date(webinar.starts_at).toLocaleDateString()) : ''} {webinar.starts_at ? new Date(webinar.starts_at).toLocaleTimeString().substring(0, 5) : ''}</span>

  return (
    <div className="reg_from_in_webinar">
      <div className="grid">
        <div className="grid_container">
          <div className="logo">EDLY</div>
          <div className="reg_in_webinar_form">
            <div className="webinar_image" style={{ backgroundImage: `url(${getBackgroundImage()})` }} />
            {webinar && (
              <div className="reg_in_webinar_form_deck">
                <div className="webinar_name">{webinar.name}</div>
                <div className="webinar_date start">{text.dateStart}: {getDateStart()}</div>
                <div className="webinar_date">{text.duration}: {getDuration()}</div>
                <div className="webinar_description">{webinar.description}</div>
                {isAuthenticated ? (
                  <div className="deck_buttons_list">
                    {webinar.is_bot_assign_required ? (
                      <>
                        {webinar.bot_url_telegram && <button onClick={() => signUp('telegram')} className="button_messenger telegram"><Telegram />{text.buttonSuccess}</button>}
                        {webinar.bot_url_whatsapp && <button onClick={() => signUp('whatsapp')} className="button_messenger whatsapp"><WhatsApp />{text.buttonSuccess}</button>}
                        {webinar.bot_url_viber && <button onClick={() => signUp('viber')} className="button_messenger viber"><Viber />{text.buttonSuccess}</button>}
                      </>
                    ) : (
                      <Button size="big" onClick={signUp} className="cabinet_profile_form_button_save" label={text.buttonSuccess} />
                    )}
                  </div>
                ) : (
                  isRegister ? (
                    <form onSubmit={formikIsLogin.handleSubmit}>
                      <Input
                        name="login"
                        type="text"
                        showError="true"
                        classNameInput="deck_input"
                        placeholder={text.placeholderSigInLogin}
                        errorText={formikIsLogin.errors.login}
                        onChange={formikIsLogin.handleChange}
                        onBlur={formikIsLogin.handleBlur}
                        value={formikIsLogin.values.login}
                      />
                      <Input
                        icon={true}
                        name="pass"
                        type="text"
                        showError="true"
                        classNameBox="deck_input"
                        placeholder={text.placeholderSigInPassword}
                        errorText={formikIsLogin.errors.pass}
                        onChange={formikIsLogin.handleChange}
                        onBlur={formikIsLogin.handleBlur}
                        value={formikIsLogin.values.pass}
                      />
                      <div className="deck_buttons_list">
                        {webinar.is_bot_assign_required ? (
                          <>
                            {webinar.bot_url_telegram && <button type="submit" onClick={() => setTypeUrl('telegram')} className="button_messenger telegram"><Telegram />{text.buttonSuccess}</button>}
                            {webinar.bot_url_whatsapp && <button type="submit" onClick={() => setTypeUrl('whatsapp')} className="button_messenger whatsapp"><WhatsApp />{text.buttonSuccess}</button>}
                            {webinar.bot_url_viber && <button type="submit" onClick={() => setTypeUrl('viber')} className="button_messenger viber"><Viber />{text.buttonSuccess}</button>}
                          </>
                        ) : (
                          <Button size="big" type="submit" className="cabinet_profile_form_button_save" label={text.buttonSuccess} />
                        )}
                        <button type="button" className="toggle_button" onClick={() => setIsRegister(false)}>Регистрация</button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={formikIsNotLogin.handleSubmit}>
                      <Input
                        name="email"
                        type="text"
                        showError={true}
                        classNameInput="deck_input"
                        placeholder={text.placeholderNotRegisteredEmail}
                        errorText={formikIsNotLogin.errors.email}
                        onChange={formikIsNotLogin.handleChange}
                        onBlur={formikIsNotLogin.handleBlur}
                        value={formikIsNotLogin.values.email}
                      />
                      <Input
                        name="phone"
                        type="text"
                        showError={true}
                        classNameInput="deck_input"
                        placeholder={text.placeholderNotRegisteredPhone}
                        errorText={formikIsNotLogin.errors.phone}
                        onChange={formikIsNotLogin.handleChange}
                        onBlur={formikIsNotLogin.handleBlur}
                        value={formikIsNotLogin.values.phone}
                      />
                      <div className="deck_checkbox">
                        <CheckBox label={true} checked={successTermsOfUse} onCheck={() => setSuccessTermsOfUse(!successTermsOfUse)}>
                          <div className="label">Я принимаю <Link className="href" to="/sla">Условия использования сервиса</Link> и <Link className="href" to="/privacy">Политику конфиденциальности</Link></div>
                        </CheckBox>
                        <CheckBox label={true} checked={successOnlyAcc} onCheck={() => setSuccessOnlyAcc(!successOnlyAcc)}>
                          <div className="label">Я подтверждаю, что сейчас регистрирую свой единственный аккаунт в сервисе.<br />
                            Мои повторные регистрации на другой e-mail будут автоматически заблокированы.<br />
                            Если мне потребуется изменить e-mail, я обращусь в техподдержку.</div>
                        </CheckBox>
                      </div>

                      <div className="deck_buttons_list">
                        {webinar.is_bot_assign_required ? (
                          <>
                            {webinar.bot_url_telegram && <button type="submit" disabled={!(successOnlyAcc && successTermsOfUse)} onClick={() => setTypeUrl('telegram')} className="button_messenger telegram"><Telegram />{text.buttonSuccess}</button>}
                            {webinar.bot_url_whatsapp && <button type="submit" disabled={!(successOnlyAcc && successTermsOfUse)} onClick={() => setTypeUrl('whatsapp')} className="button_messenger whatsapp"><WhatsApp />{text.buttonSuccess}</button>}
                            {webinar.bot_url_viber && <button type="submit" disabled={!(successOnlyAcc && successTermsOfUse)} onClick={() => setTypeUrl('viber')} className="button_messenger viber"><Viber />{text.buttonSuccess}</button>}
                          </>
                        ) : (
                          <Button size="big" type="submit" disabled={!(successOnlyAcc && successTermsOfUse)} className="cabinet_profile_form_button_save" label={text.buttonSuccess} />
                        )}
                        <button type="button" className="toggle_button" onClick={() => setIsRegister(true)}>Уже есть аккаунт</button>
                      </div>
                    </form>
                  )
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </div>

  )
}

RegFormInWebinar.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomId: PropTypes.string
    })
  })
}

export default RegFormInWebinar
