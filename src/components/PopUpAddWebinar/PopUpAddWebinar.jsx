import React, { useEffect } from 'react'
import './PopUpAddWebinar.scss'
import PropTypes from 'prop-types'
import PopUp from '../UI/PopUp'
import DatePicker, { registerLocale } from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import Button from '../UI/Button'
import ButtonBorder from '../UI/ButtonBorder'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { createWebinar } from '../../lib/admin/webinars/actions'
import { useParams } from 'react-router-dom'
import CheckBox from '../UI/CheckBox'

const text = {
  popUpAddWebinar: {
    title: 'Создать вебинар',
    dateStart: 'Дата проведения',
    dateStartPlaceholder: '00.00.0000 - 00:00',
    dateStartSubtitle: 'По московскому времени',
    btnCreate: 'Создать вебинар',
    btnCancel: 'Отмена'
  }
}

const PopUpAddWebinar = (props) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.app.user)
  const params = useParams()
  useEffect(() => { registerLocale('ru', ru) }, [])

  const createAdminWebinar = (values) => {
    dispatch(createWebinar(props.context,params.roomsId || props.room.id, { starts_at: values.dateStart, is_recordable: !!values.is_recordable }))
    props.setPopUpAddWebinar(false)
  }

  const formik = useFormik({
    initialValues: {
      dateStart: null,
      is_recordable: null
    },
    validationSchema: Yup.object().shape({
      dateStart: Yup.date().required('Введите дату начала вебинара'),
      is_recordable: Yup.bool().nullable()
    }),
    onSubmit: (values, { resetForm }) => {
      createAdminWebinar(values)
      resetForm()
    }
  })

  return (
    <PopUp
      show={props.popUpAddWebinar}
      disableScroll={true}
      title={text.popUpAddWebinar?.title}
      closePopUp={() => props.setPopUpAddWebinar(false)}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="input_ui_main popup_add_webinar_date" style={{ marginBottom: 20 }}>
          <div className="input_ui_title">{text.popUpAddWebinar?.dateStart}</div>
          <DatePicker
            name='dateStart'
            popperPlacement="top-right"
            fixedHeight={true}
            className="input_ui_input popup_add_webinar_input_date"
            onChange={(date) => formik.setFieldValue('dateStart', date)}
            selected={formik.values.dateStart}
            placeholderText={text.popUpAddWebinar?.dateStartPlaceholder}
            showTimeSelect
            timeFormat="HH:mm"
            minDate={new Date()}
            timeIntervals={30}
            timeCaption="time"
            dateFormat="dd MMMM yyyy HH:mm"
            locale="ru"
          />
          <div className="input_ui_message input_ui_message_blue">{text.popUpAddWebinar?.dateStartSubtitle}</div>
        </div>
        <CheckBox
          className={'popup_add_webinar_toggle_record'}
          checked={!!formik.values.is_recordable}
          onCheck={() => formik.setFieldValue('is_recordable', !formik.values.is_recordable)}
          label={'Запись сценария'}
        />
        <div className="popup_ui_window_buttons_list">
          <Button type="submit" size="medium" disabled={(user.account && user.account.is_limited)}>{text.popUpAddWebinar?.btnCreate}</Button>
          <ButtonBorder onClick={() => props.setPopUpAddWebinar(false)} type="button" size="medium" >{text.popUpAddWebinar?.btnCancel}</ButtonBorder>
        </div>
      </form>
    </PopUp>
  )
}

PopUpAddWebinar.propTypes = {
  setPopUpAddWebinar: PropTypes.func.isRequired,
  popUpAddWebinar: PropTypes.bool.isRequired,
  context: PropTypes.string,
  room: PropTypes.shape({
    id: PropTypes.number
  })
}

export default PopUpAddWebinar
