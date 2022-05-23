import React from 'react'
import PropTypes from 'prop-types'
import Input from '../UI/Input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import './RegistrationFinishForm.scss'
import '../CommonStyles/CommonStylesForm.scss'

const RegistrationFinishForm = (props) => {
  RegistrationFinishForm.propTypes = {
    intendedUrl: PropTypes.string,
    register: PropTypes.func.isRequired,
    authFinishRegister: PropTypes.func.isRequired,
  }

  const formik = useFormik({
    initialValues: {
      firstName: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Имя'),
    }),
    onSubmit: values => {
      props.authFinishRegister({
        first_name: values.firstName,
        intendedUrl: props.intendedUrl,
      }, props.register)
    },
  })
  return (
    <form className="registration_finish_form_options" onSubmit={formik.handleSubmit}>
      <div className="title_auth title_margin">Авторизация</div>
      <Input
        name="firstName"
        type="text"
        showError="false"
        placeholder="Имя"
        onChange={formik.handleChange}
        onBlur={null}
        value={formik.values.firstName}
        className="registration_finish_form_input_options_register"
      />
      <div className="label_bottom_info label_bottom_info_margin">Последний шаг, укажите ваше имя</div>
      <button type="submit"
        className="btn-primary register_button_option"
        disabled={!formik.values.firstName}>
        Войти
      </button>
    </form>
  )
}

export default RegistrationFinishForm
