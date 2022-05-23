import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import './Common.scss'
import SettingFooter from '../Footer'
import DatePicker, { registerLocale } from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import '../../UI/Input/input.scss'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import * as moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import CheckBox from '../../UI/CheckBox'
import { useParams } from 'react-router-dom'

const WebinarSettingCommon = (props) => {
  const params = useParams()
  const webinar = useSelector(state => state.admin.webinars.currentWebinar[params.webinarId])

  useEffect(() => { registerLocale('ru', ru) }, [])

  const formik = useFormik({
    initialValues: {
      dateStart: null,
      is_recordable: null
    },
    validationSchema: Yup.object().shape({
      dateStart: Yup.date().required(),
      is_recordable: Yup.bool().nullable()
    }),
    onSubmit: values => {
      props.saveCommonSetting(values)
    }
  })

  useEffect(() => {
    if (webinar && formik.values === formik.initialValues) {
      formik.setFieldValue('dateStart', moment.utc(webinar.starts_at).tz('Europe/Moscow').toDate())
      formik.setFieldValue('is_recordable', !!webinar.is_recordable)
    }
  }, [formik, webinar])

  return (
    <form onSubmit={formik.handleSubmit} className={'setting_padding setting_common_webinar'}>

      <div className={`input_ui_main `}>
        <div className="input_ui_title">Дата проведения</div>
        <DatePicker
          name='dateStart'
          selected={formik.values.dateStart}
          placeholderText="00.00.0000 - 00.00"
          onChange={(date) => formik.setFieldValue('dateStart', date)}
          showTimeSelect
          timeIntervals={30}
          timeFormat="HH:mm"
          className={'input_ui_input setting_common_webinar_date'}
          dateFormat="dd.MM.yyyy - HH:mm"
          locale={ru}
        />
        <div className="input_ui_message input_ui_message_blue">По московскому времени</div>
      </div>
      <CheckBox
        className={'setting_common_webinar__request_toggle'}
        checked={!!formik.values.is_recordable}
        onCheck={() => formik.setFieldValue('is_recordable', !formik.values.is_recordable)}
        label={'Запись сценария'}
      />
      <SettingFooter
        rollUp={props.rollUp}
        webinar={false}
        type="submit"
        saveSetting={null}
        text={props.text}
        className={'setting_common_webinar__footer'}
        saveSuccess={props.saveSuccess}
      />
    </form>
  )
}

WebinarSettingCommon.propTypes = {
  saveCommonSetting: PropTypes.func.isRequired,
  text: PropTypes.object.isRequired,
  rollUp: PropTypes.func,
  webinar: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    is_recordable: PropTypes.bool,
  }),
  saveSuccess: PropTypes.bool.isRequired
}

export default WebinarSettingCommon
