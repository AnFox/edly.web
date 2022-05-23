import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import './Common.scss'
import SettingFooter from '../Footer'
import Input from '../../UI/Input'
import InputIcons from '../../UI/InputIcons'
import '../../UI/Input/input.scss'
import { Telegram, Viber, WhatsApp } from '../../UI/Icons/Icons'
import ButtonBorder from '../../UI/ButtonBorder'
import Toggle from '../../UI/Toggle'
import { useFormik } from 'formik'
import DatePicker, { registerLocale } from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { updateWebinar } from '../../../lib/admin/webinars/actions'

const RoomSettingCommon = (props) => {
  const webinar = useSelector(state => state.app.webinar[props.webinarId])
  const dispatch = useDispatch()
  const inputRef = useRef()

  const saveWebinar = () => {
    dispatch(updateWebinar(webinar.id, { starts_at: formik.values.webinarStartsAt }))
  }

  const rangeHighlight = async () => {
    const doc = await new Promise((resolve) => {
      const g = document.getElementsByClassName('input_highlight')
      resolve(g)
    })
    doc[0].focus()
  }

  useEffect(() => {
    registerLocale('ru', ru)
  }, [])

  const formik = useFormik({
    initialValues: {
      isBotAssignRequired: false,
      nameRoom: '',
      urlTelegram: null,
      urlViber: null,
      urlWhatsApp: null,
      roomDescription: '',
      hours: '',
      minutes: '',
      webinarStartsAt: null
    },
    validationSchema: Yup.object().shape({
      webinarStartsAt: Yup.date().nullable(),
      isBotAssignRequired: Yup.boolean(),
      nameRoom: Yup.string().required('Введите название комнаты'),
      roomDescription: Yup.string(),
      hours: Yup.number().test('required', 'Заполните поле', (val) => (formik.values.minutes?.toString() || val)),
      minutes: Yup.number().test('required', 'Заполните поле', (val) => (formik.values.hours?.toString() || val)),
      urlTelegram: Yup.string().nullable().test('urlTelegram', 'Введите правильный URL', val => val ? val.match(/(tg:\/\/|https:\/\/t.me\/)/g) : true)
        .when(['isBotAssignRequired'], (isBotAssignRequired) => {
          if (isBotAssignRequired) {
            return Yup.string().nullable().test('isRequired', 'Заполните поле URL', (telegram) => !!(formik.values.urlViber || formik.values.urlWhatsApp || telegram))
          }
        }),
      urlWhatsApp: Yup.string().nullable().test('urlWhatsApp', 'Введите правильный URL', val => val ? val.match(/(whatsapp:\/\/|https:\/\/wa.me\/)/g) : true)
        .when(['isBotAssignRequired'], (isBotAssignRequired) => {
          if (isBotAssignRequired) {
            return Yup.string().nullable().test('isRequired', 'Заполните поле URL', (whatsApp) => !!(formik.values.urlViber || formik.values.urlTelegram || whatsApp))
          }
        }),
      urlViber: Yup.string().nullable().test('urlViber', 'Введите правильный URL', val => val ? val.match(/(viber:\/\/)/g) : true)
        .when(['isBotAssignRequired'], (isBotAssignRequired) => {
          if (isBotAssignRequired) {
            return Yup.string().nullable().test('isRequired', 'Заполните поле URL', (viber) => !!(formik.values.urlWhatsApp || formik.values.urlTelegram || viber))
          }
        })
    }),
    onSubmit: values => {
      props.saveCommonSetting(values)
    }
  })

  useEffect(() => {
    if (webinar && webinar.starts_at && !formik.values.webinarStartsAt) {
      formik.setFieldValue('webinarStartsAt', new Date(webinar.starts_at))
    }
  }, [formik, webinar])

  useEffect(() => {
    const getHours = () => {
      return Math.trunc(props.roomObject.duration_minutes / 60) < 10 ? `0${Math.trunc(
        props.roomObject.duration_minutes / 60)}` : Math.trunc(props.roomObject.duration_minutes / 60)
    }

    const getMinutes = () => {
      return props.roomObject.duration_minutes -
      (Math.trunc(props.roomObject.duration_minutes / 60) * 60) < 10
        ? `0${props.roomObject.duration_minutes -
        (Math.trunc(props.roomObject.duration_minutes / 60) * 60)}`
        : props.roomObject.duration_minutes - (Math.trunc(props.roomObject.duration_minutes / 60) * 60)
    }

    if (props.roomObject && Object.keys(props.roomObject).length) {
      formik.setValues({
        nameRoom: props.roomObject.name,
        roomDescription: props.roomObject.description || '',
        urlTelegram: props.roomObject.bot_url_telegram || '',
        urlWhatsApp: props.roomObject.bot_url_whatsapp || '',
        urlViber: props.roomObject.bot_url_viber || '',
        isBotAssignRequired: !!props.roomObject.is_bot_assign_required,
        hours: props.roomObject.duration_minutes && getHours(),
        minutes: props.roomObject.duration_minutes && getMinutes(),
        webinarStartsAt: formik.values.webinarStartsAt || null
      }, false)
    }
  }, [props.roomObject])

  useEffect(() => {
    if (formik.values.hours?.toString().length >= 2) {
      document.getElementById('minutes').focus()
    }
  }, [formik.values.hours])

  useEffect(() => {
    if (formik.values.minutes === '') {
      document.getElementById('hours').focus()
    }
  }, [formik.values.minutes])

  return (
    <form onSubmit={formik.handleSubmit} className={props.webinarLocation ? 'setting_webinar_padding setting_webinar_common' : 'setting_padding setting_common'}>
      <Input
        name="nameRoom"
        title={true}
        titleText="Название вебинара"
        placeholder="Введите заголовок комнаты"
        value={formik.values.nameRoom}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        showError={true}
        errorText={formik.errors.nameRoom}
        className={`${props.webinarLocation ? 'setting_webinar_input setting_webinar__webinar_name' : 'setting_webinar_name'}`}
      />
      <div className={`input_ui_main ${props.webinarLocation ? 'setting_webinar_input setting_webinar_dscription' : 'setting_textarea_block'}`}>
        <div className="input_ui_title">Описание</div>
        <div style={{ textAlign: 'left' }}>
          <textarea
            name='roomDescription'
            placeholder="Введите описание для комнаты"
            className={`  ${props.webinarLocation ? 'setting_webinar_input setting_webinar_common_textarea' : 'setting_common_textarea'}`}
            value={formik.values.roomDescription} onChange={formik.handleChange}
          />
        </div>
        <div className="input_ui_message input_ui_message_blue">Пользователи будут видеть при входе в комнату</div>
      </div>
      <div className="setting_date_start_options">
        {props.webinarLocation &&
        <div className={`input_ui_main ${props.webinarLocation ? 'setting_webinar_input setting_webinar_date_start_options__date_block' : 'setting_date_start_options__date_block'}`}>
          <div className="input_ui_title">Дата проведения</div>
          <DatePicker
            name='webinarStartsAt'
            selected={formik.values.webinarStartsAt}
            placeholderText="00.00.0000 - 00.00"
            onChange={(date) => formik.setFieldValue('webinarStartsAt', date)}
            showTimeSelect
            timeFormat="HH:mm"
            minDate={new Date()}
            timeIntervals={30}
            timeCaption="time"
            dateFormat="dd MMMM yyyy HH:mm"
            className={`input_ui_input ${props.webinarLocation ? 'webinar_setting_date_start_options__date' : 'setting_date_start_options__date'}`}
            locale={ru}
          />
          <div className="input_ui_message input_ui_message_blue">По московскому времени</div>
        </div>}
        <div className={`input_ui_main ${props.webinarLocation ? 'setting_webinar_input webinar_setting_date_start_options__time_block' : 'setting_date_start_options__time_block'}`}>
          <div className="input_ui_title">Продолжительность</div>
          <div className="webinar_setting_date_start_options__time_block_box">
            <input
              name='hours'
              tabIndex={4}
              type="text"
              maxLength={2}
              className={`input_ui_input ${props.webinarLocation ? 'webinar_setting_date_start_options__time' : 'setting_date_start_options__time'}`}
              placeholder="ЧЧ" id="hours"
              value={formik.values.hours || ''}
              onChange={formik.handleChange} />
            <input
              name='minutes'
              tabIndex={5}
              type="text"
              maxLength={2}
              className={`input_ui_input ${props.webinarLocation ? 'webinar_setting_date_start_options__time' : 'setting_date_start_options__time'}`}
              placeholder="ММ" id="minutes"
              value={formik.values.minutes || ''}
              onChange={formik.handleChange} />
          </div>
        </div>
      </div>
      <div className={props.webinarLocation ? 'webinar_setting_copy_href' : 'setting_copy_href'}>
        <Input
          title={true}
          value={props.roomObject?.url}
          defaultValue={props.roomObject?.url}
          titleText="Открытая ссылка для зрителей"
          placeholder="https://..."
          onChange={null}
          refInput={inputRef}
          refBool={true}
          onFocus={() => inputRef.current.select()}
          className={`${props.webinarLocation ? 'setting_webinar_input webinar_setting_open_href' : 'setting_open_href'}`}
          classNameInput={`input_highlight ${props.webinarLocation ? '' : 'setting_open_href_input'}`}
          showError={true}
          colorMessage="blue"
          errorText={'CTRL + C, чтобы скопировать'}
        />
        <ButtonBorder type='button' onClick={() => { rangeHighlight(); document.execCommand('copy') }} label={props.text.copyURL} size={props.webinarLocation ? 'small' : 'medium'} color="blue" />
      </div>
      <div className="webinar_bot_href_list">
        <Toggle
          id="isBotAssignRequired"
          name="isBotAssignRequired"
          selected={formik.values.isBotAssignRequired}
          onChange={formik.handleChange}
          classList='webinar_bot_href_list_toggle'
          label={'запись на вебинар через мессенджеры'}
        />

        {formik.values.isBotAssignRequired ? (
          <>
            <InputIcons
              name='urlTelegram'
              icon={Telegram}
              className='href_bot_input'
              placeholder={'Ссылка на бота в Telegram'}
              errorText={formik.errors.urlTelegram}
              showError={true}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.urlTelegram}
            />
            <InputIcons
              name='urlWhatsApp'
              icon={WhatsApp}
              className='href_bot_input'
              placeholder={'Ссылка на бота в WhatsApp'}
              errorText={formik.errors.urlWhatsApp}
              showError={true}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.urlWhatsApp}
            />
            <InputIcons
              name='urlViber'
              icon={Viber}
              className='href_bot_input'
              placeholder={'Ссылка на бота в Viber'}
              errorText={formik.errors.urlViber}
              showError={true}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.urlViber}
            />
          </>
        ) : null}

      </div>
      <SettingFooter saveSuccess={props.saveSuccess} rollUp={props.rollUp} type="submit" saveSetting={props.webinarLocation ? saveWebinar : null} webinar={props.webinarLocation} text={props.text} />
    </form>
  )
}

RoomSettingCommon.propTypes = {
  rollUp: PropTypes.func.isRequired,
  saveCommonSetting: PropTypes.func.isRequired,
  webinarLocation: PropTypes.bool.isRequired,
  text: PropTypes.object.isRequired,
  roomObject: PropTypes.shape({
    name: PropTypes.string,
    is_bot_assign_required: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    urlTelegram: PropTypes.string,
    urlWhatsApp: PropTypes.string,
    urlViber: PropTypes.string,
    duration_minutes: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string,
    bot_url_telegram: PropTypes.string,
    bot_url_whatsapp: PropTypes.string,
    bot_url_viber: PropTypes.string
  }),
  saveSuccess: PropTypes.bool,
  webinarId: PropTypes.number
}

export default RoomSettingCommon
