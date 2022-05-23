import React from 'react'
import PropTypes from 'prop-types'
import Input from '../UI/Input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { animateScroll as scroll } from 'react-scroll'
import { Checkbox } from '@material-ui/core'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { Link } from 'react-router-dom'
import './RegistrationForm.scss'
import '../CommonStyles/CommonStylesForm.scss'
import { useSelector, useDispatch } from 'react-redux'
import { authRegister } from '../../lib/auth/actions'
import Button from '../UI/Button'

const RegistrationForm = (props) => {
  const intendedUrl = useSelector(state => state.app.navigation?.intendedUrl)
  const dispatch = useDispatch()

  const scrollToTop = () => {
    scroll.scrollToTop()
  }
  const formik = useFormik({
    initialValues: {
      email: '',
      phone: '',
      successTermsOfUse: false,
      successOnlyAcc: false
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email введён неверно')
        .trim()
        .required('Введите Email'),
      phone: Yup.string()
        .required('Введите номер телефона')
        .test('min', 'Не менее 12 символов', val => val && val.toString().length > 11)
        .test('max', 'Не более 16 символов', val => val && val.toString().length <= 16)
        .test('international', 'Введите номер в международном формате', val => val ? (val.match(/^\+\d{11}/g) || val.match(/^\+\d{15}/g)) : true)
      ,
      successTermsOfUse: Yup.bool(),
      successOnlyAcc: Yup.bool()
    }),
    onSubmit: values => {
      dispatch(authRegister({
        email: values.email.trim(),
        phone: values.phone,
        successTermsOfUse: values.successTermsOfUse,
        successOnlyAcc: values.successOnlyAcc,
        intendedUrl: intendedUrl
      }, props.register))
    }
  })
  return (
    <form className="registration_form_options" onSubmit={formik.handleSubmit}>
      <div className="title_auth title_margin">Регистрация</div>
      <Input
        name="phone"
        type="tel"
        showError={true}
        placeholder="Телефон"
        errorText={formik.errors.phone}
        onChange={formik.handleChange}
        onBlur={null}
        value={formik.values.phone}
        className="input_options_register"
      />
      <Input
        name="email"
        type="email"
        showError={true}
        placeholder="Эл. почта"
        errorText={formik.errors.email}
        onChange={formik.handleChange}
        onBlur={null}
        value={formik.values.email}
        className="input_options_register"
      />
      <div className="checkbox_grid">
        <div className="reg_checkbox">
          <Checkbox
            style={{ color: '#598BFF', backgroundColor: 'none', padding: '0' }}
            checked={formik.values.successTermsOfUse}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            onChange={() => formik.setFieldValue('successTermsOfUse', !formik.values.successTermsOfUse)}
            name="checkedB"
            color="primary"
          />
        </div>
        <div className="label label_one_option">Я принимаю <Link className="href" to="/sla">Условия использования сервиса</Link><br /> и <Link className="href" to="/privacy">Политику конфиденциальности</Link></div>
      </div>
      <div className="checkbox_grid">
        <div className="reg_checkbox">
          <Checkbox
            style={{ color: '#598BFF', backgroundColor: 'none', padding: '0' }}
            checked={formik.values.successOnlyAcc}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            onChange={() => formik.setFieldValue('successOnlyAcc', !formik.values.successOnlyAcc)}
            name="checkedB"
            color="primary"
          />
        </div>

        <div className="label label_two_option">Я подтверждаю, что сейчас регистрирую свой единственный аккаунт в сервисе.
                                  Мои повторные регистрации на другой e-mail будут автоматически заблокированы.
                                  Если мне потребуется изменить e-mail, я обращусь в техподдержку.</div>

      </div>
      <Button
        disabled={!(formik.values.phone && formik.values.email && formik.values.successOnlyAcc && formik.values.successTermsOfUse)}
        size="big"
      >
        Зарегистрироваться
      </Button>
      {/* <div className="label reg_label_three">Или войти как пользователь</div>
        <div className="authform_social_icons">
          <img src={Facebook} alt="Facebook" />
          <img src={Google} alt="Google" />
          <img src={VK} alt="VK" />
        </div> */}
      <div className="authform_line reg_line_margin" />
      <div className="label reg_label_four">Уже есть аккаунт? <Link className="href" to="/login">Войти</Link></div>
      <div className="btn_up reg_btn_up" onClick={scrollToTop}>
        <ExpandLessIcon />
      </div>
    </form>
  )
}

RegistrationForm.propTypes = {
  intendedUrl: PropTypes.string,
  register: PropTypes.func.isRequired
}

export default RegistrationForm
