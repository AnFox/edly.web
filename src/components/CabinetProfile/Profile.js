import React, { useEffect, useState } from 'react'
import './Profile.scss'
import Input from '../UI/Input'
import '../UI/Input/input.scss'
import ButtonBorder from '../UI/ButtonBorder'
import Button from '../UI/Button'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { updateUser } from '../../lib/app/user/actions'
import PopUp from '../UI/PopUp'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const text = {
  first_name: 'Имя',
  last_name: 'Фамилия',
  email: 'Эл. почта',
  phone: 'Телефон',
  password_change: 'Изменение пароля',
  password_current: 'Текущий пароль',
  password: 'Новый пароль',
  password_confirmation: 'Подтверждение нового пароля',
  button: 'Сохранить',
  buttonEdit: 'Изменить'
}

const Profile = () => {
  const user = useSelector(state => state.app.user)
  const dispatch = useDispatch()
  const [showModalPassword, setShowModalPassword] = useState(false)

  useEffect(() => {
    formik.setFieldValue('email', user.email, false)
    formik.setFieldValue('phone', user.phone, false)
  }, [user])

  const changePassword = (e) => {
    e.preventDefault()
    setShowModalPassword(!showModalPassword)
  }

  const formik = useFormik({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('Введите имя'),
      last_name: Yup.string().nullable(),
      email: Yup.string()
        .email('Email введён неверно')
        .required('Введите Email'),
      phone: Yup.string()
        .required('Введите номер телефона')
        .test('min', 'Не менее 12 символов', val => val && val.toString().length > 11)
        .test('max', 'Не более 16 символов', val => val && val.toString().length <= 16)
        .test('international', 'Введите номер в международном формате', val => val ? ((val.match(/^\+\d{11}/g) || !val.match(/^8/)) || val.match(/^\+\d{15}/g)) : true)
      ,
      password_current: Yup.string()
        .min(6, 'Не менее 6 символов')
        .required('Введите текущий пароль')
    }),
    onSubmit: values => {
      dispatch(updateUser(values))
    }
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="cabinet_profile_form">
        <Input
          id="first_name"
          name="first_name"
          type="text"
          title="true"
          showError="true"
          className="cabinet_profile_form_input_main"
          classNameInput="cabinet_profile_form_input"
          titleText={text.first_name}
          errorText={formik.errors.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.first_name}
        />
        <Input
          id="last_name"
          name="last_name"
          type="text"
          title="true"
          showError="true"
          className="cabinet_profile_form_input_main"
          classNameInput="cabinet_profile_form_input"
          titleText={text.last_name}
          errorText={formik.errors.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.last_name}
        />

        <Input
          id="email"
          name="email"
          type="email"
          title="true"
          showError="true"
          className="cabinet_profile_form_input_main"
          classNameInput="cabinet_profile_form_input"
          titleText={text.email}
          errorText={formik.errors.email || (user.new_email && !user.email_verified_at && `Подтверждение выслано на почту ${user.new_email}`)}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />

        <Input
          id="phone"
          name="phone"
          type="text"
          title="true"
          showError={formik.errors.phone}
          placeholder={'+_(___) ___-__-__'}
          className="cabinet_profile_form_input_main"
          classNameInput="cabinet_profile_form_input"
          titleText={text.phone}
          errorText={formik.errors.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone}
        />
        {user.new_phone && !user.phone_verified_at && !formik.errors.phone && (
          <div className="input_ui_message sms_verify">
            <Link to="/verifyphone">Требуется подтверждение.</Link>
            <br/>
            Код выслан на {user.new_phone}
          </div>
        )}

        <div className="cabinet_profile_box">
          <Input
            id="password_current"
            name="password_current"
            type="password"
            title="true"
            showError="true"
            icon={true}
            className="cabinet_profile_form_input_main"
            classNameBox="cabinet_profile_form_input"
            titleText={text.password_current}
            errorText={formik.errors.password_current}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password_current}
          />
          <ButtonBorder size="medium" label={text.buttonEdit}
            onClick={changePassword}/>
        </div>

        <Button size="medium" type="submit"
          className="cabinet_profile_form_button_save"
          label={text.button}/>
      </form>

      {showModalPassword && (
        <PopUp
          show={showModalPassword}
          disableScroll={false}
          showButtonAccept={false}
          showButtonCancel={false}
          title={text.password_change}
          closePopUp={() => setShowModalPassword(false)}
        >
          <PasswordChangeForm
            onSuccess={() => setShowModalPassword(false)}
          />
        </PopUp>
      )}
    </>
  )
}

const PasswordChangeForm = (props) => {
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      password_current: '',
      password: '',
      password_confirmation: ''
    },
    validationSchema: Yup.object({
      password_current: Yup.string()
        .min(6, 'Не менее 6 символов')
        .required('Введите текущий пароль'),
      password: Yup.string()
        .min(6, 'Не менее 6 символов')
        .required('Введите новый пароль'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')],
          'Новый пароль и его подтверждение должны совпадать')
        .required('Введите подтверждение пароля')
    }),
    onSubmit: async values => {
      await dispatch(updateUser(values))
      props.onSuccess()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="cabinet_profile_form">
      <Input
        id="password_current"
        name="password_current"
        type="password"
        title="true"
        showError="true"
        icon={true}
        className="cabinet_profile_form_input_main cabinet_profile_form_input_old_pass"
        classNameBox="cabinet_profile_form_input"
        titleText={text.password_current}
        errorText={formik.errors.password_current}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password_current}
      />
      <Input
        id="password"
        name="password"
        type="password"
        title="true"
        showError="true"
        icon={true}
        className="cabinet_profile_form_input_main cabinet_profile_form_input_old_pass"
        classNameBox="cabinet_profile_form_input"
        titleText={text.password}
        errorText={formik.errors.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />

      <Input
        id="password_confirmation"
        name="password_confirmation"
        type="password"
        title="true"
        showError="true"
        icon={true}
        className="cabinet_profile_form_input_main cabinet_profile_form_input_old_pass"
        classNameBox="cabinet_profile_form_input"
        titleText={text.password_confirmation}
        errorText={formik.errors.password_confirmation}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password_confirmation}
      />

      <Button size="medium" type="submit"
        className="cabinet_profile_form_button_save"
        label={text.button}/>
    </form>
  )
}

PasswordChangeForm.propTypes = {
  onSuccess: PropTypes.func.isRequired
}

export default Profile
