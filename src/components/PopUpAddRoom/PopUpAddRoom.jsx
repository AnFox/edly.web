import React, { useEffect } from 'react'
import './PopUpAddRoom.scss'
import Input from '../UI/Input'
import ButtonBorder from '../UI/ButtonBorder'
import Button from '../UI/Button'
import PopUp from '../UI/PopUp'
import { useFormik } from 'formik'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { postGenerateSlug, postRoom } from '../../lib/admin/rooms/actions'
import { useDispatch, useSelector } from 'react-redux'

const text = {
  popUpButtonCancel: 'Отмена',
  buttonGenerate: 'Сгенерировать',
  popUpAddRoom: {
    title: 'Создать комнату',
    buttonAddRoom: 'Создать комнату',
    inputNameRoomTitle: 'Заголовок в вебинарной комнате',
    inputNameRoomPlaceholder: 'Example_name',
    inputDateRoomPlaceholder: '00.00.0000 - 00:00',
    inputDurationPlaceholder: '00:00',
    inputDurationTitle: 'Продолжительность',
    inputDateRoomSubtitle: 'По московскому времени',
    inputIdRoomTitle: 'Идентификатор комнаты',

    inputIdRoomPlaceholder: 'Example_ID',
    inputIdRoomSubtitle: 'Только английские буквы, цифры, знак подчеркивания и тире.',
    date: 'Дата проведения',
    text: 'Комната будет доступна по адресу: /room/',
    attention: 'Внимание:',
    attentionText: 'Ссылку на комнату изменить будет нельзя!'
  }
}

const PopUpAddRoom = (props) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.app.user)

  const formik = useFormik({
    initialValues: {
      nameRoom: '',
      slug: '',
      hours: '',
      minutes: ''
    },
    validationSchema: Yup.object().shape({
      nameRoom: Yup.string().required('Введите название комнаты'),
      slug: Yup.string().required(),
      hours: Yup.number().test('required', 'Заполните поле', (val) => (formik.values.minutes?.toString() || val)),
      minutes: Yup.number().test('required', 'Заполните поле', (val) => (formik.values.hours?.toString() || val))
    }),
    onSubmit: (values, { resetForm }) => {
      createRoom(values)
      resetForm()
    }
  })

  const createRoom = (values) => {
    const duration = ((+values.hours * 60) + +values.minutes)
    dispatch(postRoom({ slug: values.slug, name: values.nameRoom, duration_minutes: duration }))
    props.setPopUpAddRoom(false)
  }

  const generateId = async () => {
    const slug = await dispatch(postGenerateSlug())
    formik.setFieldValue('slug', slug)
  }

  useEffect(() => {
    const backToHours = (e) => {
      if (e.code === 'Backspace' && formik.values.minutes === '') {
        document.getElementById('hours').focus()
      }
    }

    document.getElementById('minutes').addEventListener('keydown', backToHours)

    if (formik.values.hours.toString().length >= 2) {
      document.getElementById('minutes').focus()
    }
    return () => document.getElementById('minutes').removeEventListener('keydown', backToHours)
  }, [formik.values.hours, formik.values.minutes])

  const isDisabled = () => (user.account && user.account.is_limited) ||
    !(formik.values.nameRoom && formik.values.slug && (formik.values.hours || formik.values.minutes))

  return (
    <PopUp
      className="popup_add_room"
      show={props.popUpAddRoom}
      disableScroll={true}
      title={text.popUpAddRoom.title}
      closePopUp={() => props.setPopUpAddRoom(false)}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="popup_add_room_title_webinar">
          <Input
            tabIndex={1}
            name="nameRoom"
            classNameInput="popup_add_room_input"
            title={true}
            className="popup_add_room_name"
            showError={true}
            titleText={text.popUpAddRoom.inputNameRoomTitle}
            placeholder={text.popUpAddRoom.inputNameRoomPlaceholder}
            value={formik.values.nameRoom}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="popup_add_room_time_duration">
          <div className="input_ui_main popup_add_room_duration">
            <div className="input_ui_title">{text.popUpAddRoom.inputDurationTitle}</div>
            <div className="popup_add_room_duration_flex">
              <input
                name="hours"
                id="hours"
                type="number"
                tabIndex={2}
                maxLength={2}
                className={'input_ui_input popup_add_room_input_duration'}
                placeholder="ЧЧ"
                value={formik.values.hours}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <input
                name="minutes"
                id="minutes"
                tabIndex={3}
                maxLength={2}
                type="number"
                className={'input_ui_input popup_add_room_input_duration'}
                placeholder="ММ"
                value={formik.values.minutes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="input_ui_message input_ui_message_blue"/>
          </div>
        </div>
        <div className="popup_add_room_id_generate">
          <Input
            name="slug"
            tabIndex={4}
            className="popup_add_room_id"
            classNameInput="popup_add_room_input"
            title={true}
            titleText={text.popUpAddRoom.inputIdRoomTitle}
            placeholder={text.popUpAddRoom.inputNameRoomPlaceholder}
            showError={true}
            errorText={text.popUpAddRoom.inputIdRoomSubtitle}
            value={formik.values.slug}
            colorMessage="blue"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ButtonBorder
            type="button"
            size="medium"
            color="blue"
            label={text.buttonGenerate}
            onClick={() => generateId()}
          />
        </div>
        <div className="rooms_text rooms_admin_alert_text_option">
          <div>{text.popUpAddRoom.text}{formik.values.slug || 'Example_id'}</div>
          <div><strong>{text.popUpAddRoom.attention}</strong> {text.popUpAddRoom.attentionText}</div>
        </div>
        <div className="popup_ui_window_buttons_list">
          <Button type="submit" size="medium" disabled={isDisabled()}>{text.popUpAddRoom.buttonAddRoom}</Button>
          <ButtonBorder onClick={() => {props.setPopUpAddRoom(false); formik.resetForm()}} type="button" size="medium" >{text.popUpButtonCancel}</ButtonBorder>
        </div>
      </form>
    </PopUp>
  )
}

PopUpAddRoom.propTypes = {
  popUpAddRoom: PropTypes.bool.isRequired,
  setPopUpAddRoom: PropTypes.func.isRequired
}

export default PopUpAddRoom
