import React, { useState } from 'react'
import Input from '../UI/Input'
import Button from '../UI/Button'
import RadioButton from '../UI/RadioButton'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import './Common.scss'
import { setAccountPaymentSettings } from "../../lib/app/user/actions"
import SaveSettingCheckSuccess from '../UI/SaveSettingCheckSuccess'


const paymentSystemCloudPayments = 'CloudPayments'
const cashBoxCloudPayments = 'CloudPayments'
const cashBoxATOL = 'ATOL'

const text = {
  type: 'Тип кассы',
  paymentSystem: 'Платежная Система',
  cashBoxTitleCloudPayments: 'Встроенная',
  cashBoxTitleATOL: 'АТОЛ',
  inn: 'ИНН',
  login: 'Логин',
  password: 'Пароль',
  group: 'Группа',
  publicKey: 'Публичный ключ',
  privateKey: 'Приватный ключ',
  buttonSave: 'Сохранить',
}

const Common = () => {
  const account = useSelector(state => state.app.user.account)
  const defaultPaymentSystemName = paymentSystemCloudPayments
  const dispatch = useDispatch()
  const [isSaveSetting, setIsSaveSetting] = useState(false)

  const [cashboxSystem, setCashboxSystem] = useState(account.cashbox ? account.cashbox.system : cashBoxCloudPayments)
  const [paymentSystem, setPaymentSystem] = useState(account.cashbox ? defaultPaymentSystemName : paymentSystemCloudPayments)

  const formik = useFormik({
    initialValues: {
      inn: account.cashbox ? account.cashbox.inn : '',
      login: account.cashbox ? account.cashbox.login : '',
      password: account.cashbox ? account.cashbox.password : '',
      group: account.cashbox ? account.cashbox.group : '',
      publicKey: account.payment ? account.payment[defaultPaymentSystemName].public_key : '',
      privateKey: account.payment ? account.payment[defaultPaymentSystemName].private_key : '',
    },
    validationSchema: cashboxSystem === 'ATOL' ? Yup.object({
      inn: Yup.string().required('Введите ИНН'),
      login: Yup.string().required('Введите логин'),
      password: Yup.string().required('Введите пароль'),
      group: Yup.string().required('Введите группу'),
      publicKey: Yup.string().required('Введите публичный ключ'),
      privateKey: Yup.string().required('Введите приватный ключ')
    })
      : Yup.object({
        publicKey: Yup.string().required('Введите публичный ключ'),
        privateKey: Yup.string().required('Введите приватный ключ')
      }),
    onSubmit: values => {
      let data = cashboxSystem === cashBoxATOL ? {
        cashbox_system: cashboxSystem,
        cashbox_inn: values.inn,
        cashbox_login: values.login,
        cashbox_password: values.password,
        cashbox_group: values.group,
        payment_system: paymentSystem,
        payment_system_public_key: values.publicKey,
        payment_system_private_key: values.privateKey,
      } : {
        cashbox_system: cashboxSystem,
        payment_system: paymentSystem,
        payment_system_public_key: values.publicKey,
        payment_system_private_key: values.privateKey
      }

      dispatch(setAccountPaymentSettings(data)).then(() => {
        setIsSaveSetting(true)
        setTimeout(() => setIsSaveSetting(false), 5000)
      })

    },
  })

  const getDisabled = () => {
    let bool = false
    if (cashboxSystem === 'ATOL'){
      bool = !(cashboxSystem && formik.values.login && formik.values.password && formik.values.group && paymentSystem && formik.values.publicKey && formik.values.privateKey)
    }
    if (cashboxSystem === 'CloudPayments'){
      bool = !(cashboxSystem && formik.values.publicKey && formik.values.privateKey && paymentSystem)
    }
    return bool
  }

  return(
    <form className="cashbox_content_padding" onSubmit={formik.handleSubmit}>
      <div className="cashbox_content_row">
        <div className="cashbox_content_left">
          <div className="cashbox_content_radio_button_list_main">
            <div className="cashbox_content_label cashbox_content_subtitle">{text.type}</div>
            <div className="cashbox_content_radio_button_list">
              <RadioButton
                selected={cashboxSystem === cashBoxCloudPayments}
                label={text.cashBoxTitleCloudPayments}
                controll={true}
                onSelect={() => setCashboxSystem(cashBoxCloudPayments)}
              />
              <RadioButton
                selected={cashboxSystem === cashBoxATOL}
                label={text.cashBoxTitleATOL}
                controll={true}
                onSelect={() => setCashboxSystem(cashBoxATOL)}
              />
            </div>
          </div>
          <Input
            name="inn"
            disabled={cashboxSystem !== cashBoxATOL}
            title={true}
            titleText={text.inn}
            showError={true}
            errorText={cashboxSystem === cashBoxATOL ? formik.errors.inn : ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.inn}
            classNameInput="cashbox_content_input_type"
          />
          <Input
            name="login"
            disabled={cashboxSystem !== cashBoxATOL}
            title={true}
            titleText={text.login}
            showError={true}
            errorText={cashboxSystem === cashBoxATOL ? formik.errors.login : ''}
            onChange={formik.handleChange}
            onBlur={null}
            value={formik.values.login}
            classNameInput="cashbox_content_input_type"
          />
          <Input
            name="password"
            disabled={cashboxSystem !== cashBoxATOL}
            icon={true}
            title={true}
            titleText={text.password}
            showError={true}
            errorText={cashboxSystem === cashBoxATOL ? formik.errors.password : ''}
            onChange={formik.handleChange}
            onBlur={null}
            value={formik.values.password}
            classNameBox="cashbox_content_input_type"
          />
          <Input
            name="group"
            disabled={cashboxSystem !== cashBoxATOL}
            title={true}
            titleText={text.group}
            showError={true}
            errorText={cashboxSystem === cashBoxATOL ? formik.errors.group : ''}
            onChange={formik.handleChange}
            onBlur={null}
            value={formik.values.group}
            classNameInput="cashbox_content_input_type"
          />
        </div>
        <div className="cashbox_content_right">
          <div className="cashbox_content_radio_button_list_main">
            <div className="cashbox_content_label cashbox_content_subtitle">{text.paymentSystem}</div>
            <RadioButton
              selected={paymentSystem === paymentSystemCloudPayments}
              label={defaultPaymentSystemName}
              controll={true}
              onSelect={() => setPaymentSystem(defaultPaymentSystemName)}
            />
          </div>
          <Input
            name="publicKey"
            title={true}
            titleText={text.publicKey}
            showError={true}
            errorText={formik.errors.publicKey}
            onChange={formik.handleChange}
            onBlur={null}
            value={formik.values.publicKey}
            classNameInput="cashbox_content_input_key"
          />
          <Input
            name="privateKey"
            title={true}
            titleText={text.privateKey}
            showError={true}
            errorText={formik.errors.privateKey}
            onChange={formik.handleChange}
            onBlur={null}
            value={formik.values.privateKey}
            classNameInput="cashbox_content_input_key"
          />
        </div>
      </div>

      <div className={'cashbox_content__save_button'}>
        <Button disabled={getDisabled()} size="medium" color="blue" type="submit" label={text.buttonSave} />
        <SaveSettingCheckSuccess delay={3100} saveSuccess={isSaveSetting} />
      </div>
    </form>
  )
}

export default Common
