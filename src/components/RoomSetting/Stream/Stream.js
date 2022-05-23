import React, { useEffect } from 'react'
import SettingFooter from '../Footer'
import '../../UI/Input/input.scss'
import PropTypes from 'prop-types'
import './Stream.scss'
import LiveStream from './LiveStream'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { WebinarType } from '../../../dict/webinar'
import AutoStream from './AutoStream'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const Stream = (props) => {
  const params = useParams()
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])

  const formik = useFormik(
    {
      initialValues: {
        typeStream: null,
        scheduleInterval: '',
        videoSrc: '',
        videoSrcType: 'YouTube',
        scheduledAt: '',
        requestRecord: null
      },
      validationSchema: Yup.object({
        typeStream: Yup.number().required('Выберите тип трансляции'),
        scheduledAt: Yup.string().nullable().when(['typeStream'], (typeStream) => {
          if (+typeStream === 2 && formik.values.scheduleInterval) {
            return Yup.string().nullable().required('Выберите дату')
          }
        }),
        scheduleInterval: Yup.string().nullable().when(['typeStream'], (typeStream) => {
          if (+typeStream === 2 && formik.values.scheduledAt) {
            return Yup.string().nullable().required('Выберите интервал')
          }
        }),
        videoSrc: Yup.string().nullable(),
        requestRecord: Yup.bool().nullable()
      }),
      onSubmit: values => {
        props.saveStreamSetting(values)
      }
    }
  )

  const isDisabled = () => {
    // данный блок кода не нужен, так как вебинар может функционировать без видео
    // if (!formik.values.videoSrc) {
    //   return true
    // }
    if (formik.values.typeStream === 2) {
      if (formik.values.scheduledAt || formik.values.scheduleInterval) {
        return !(formik.values.scheduleInterval && formik.values.scheduledAt)
      } else {
        return false
      }
    }
  }

  useEffect(() => {
    if (room) {
      formik.setFieldValue('typeStream', room.type_id)
      formik.setFieldValue('videoSrc', room.video_src)
      formik.setFieldValue('scheduleInterval', room.schedule_interval)
      formik.setFieldValue('requestRecord', !!room.request_record)
      formik.setFieldValue('scheduledAt', room.scheduled_at ? new Date(room.scheduled_at) : '')
    }
  }, [room])

  return (
    <div className={`${props.webinarLocation ? 'setting_webinar_padding setting_webinar_stream' : ' setting_padding setting_stream'}`}>
      <form onSubmit={formik.handleSubmit}>
        <div className="setting_stream_toggle">
          <div
            className={`setting_stream_toggle_live ${formik.values.typeStream === WebinarType.LIVE ? ' setting_stream_toggle_selected' : ''}`}
            onClick={() => formik.setFieldValue('typeStream', 1)}
          >
            Живой вебинар
          </div>
          <div
            className={`setting_stream_toggle_auto ${formik.values.typeStream === WebinarType.AUTO ? ' setting_stream_toggle_selected' : ''}`}
            onClick={() => formik.setFieldValue('typeStream', 2)}
          >
            Автовебинар
          </div>
        </div>
        <LiveStream
          isWebinar={props.webinarLocation}
          values={formik.values}
          setFieldValue={formik.setFieldValue}
        />
        {formik.values.typeStream === WebinarType.AUTO &&
          <AutoStream
            isWebinar={props.webinarLocation}
            values={formik.values}
            setFieldValue={formik.setFieldValue}
          />
        }
        <SettingFooter type="submit" rollUp={props.rollUp} saveSuccess={props.saveSuccess} disabledSaveButton={isDisabled()} webinar={props.webinarLocation} text={props.text} />
      </form>

    </div>
  )
}

Stream.propTypes = {
  checkBoxState: PropTypes.string,
  rollUp: PropTypes.func,
  webinarLocation: PropTypes.bool.isRequired,
  saveStreamSetting: PropTypes.func,
  text: PropTypes.object,
  saveSuccess: PropTypes.bool
}

export default Stream
