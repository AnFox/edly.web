import React, { useEffect } from 'react'
import './PopUpCreateOrEditCommand.scss'
import PropTypes from 'prop-types'
import PopUp from '../../UI/PopUp'
import Button from '../../UI/Button'
import ButtonBorder from '../../UI/ButtonBorder'
import InputIcon from '../../UI/InputIcons'
import Select from '../../UI/Select'
import TimeshiftInputsForm from '../TimeshiftInputsForm'
import { CloseIcon } from '../../UI/Icons/Icons'
import { useFormik } from 'formik'
import RadioButton from '../../UI/RadioButton'
import { msToTime } from '../../../utils/msToTime'
import { useSelector, useDispatch } from 'react-redux'
import { updateCommand, createCommand } from '../../../lib/admin/scenario/actions'
import * as Yup from 'yup'

import { useParams } from 'react-router-dom'
import validationSchema from './validationShema'
import validationSchemaTimeshift from '../validationSchemaTimeshift'

const PopUpCreateOrEditCommand = (props) => {
  const params = useParams()
  const scenarioSelector = useSelector(state => state.admin.scenario[params.roomId])
  const dispatch = useDispatch()
  const banners = useSelector(state => state.admin.banner.banners)
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])
  const { isEdit } = props

  const getPayload = (action, values) => {
    switch (action) {
    case 'setCurrentSlide':
      return JSON.stringify({ page: values.presentationPage })
    case 'postMessage':
      return JSON.stringify({ role: values.role.value, message: values.content, username: values.userName })
    case 'setWebinarLayout':
      return JSON.stringify({ layout: values.webinarLayout })
    case 'chatBlock':
    case 'chatUnblock':
      return JSON.stringify([])
    case 'stopStream':
      return JSON.stringify([])
    case 'startStream':
      return JSON.stringify({ url: values.startStopWebinar })
    case 'postBanner':
      return JSON.stringify({ id: values.bannerId })
    case 'startRecord':
      return JSON.stringify({ text: 'Начало записи' })
    case 'stopRecord':
      return JSON.stringify({ text: 'Конец записи' })
    default:
      return ''
    }
  }

  const getTimeshift = (values) => {
    return (+values.hours * 60 * 60 * 1000) + (+values.minutes * 60 * 1000) + (+values.seconds * 1000) + +values.ms
  }

  const getActionType = (values) => {
    switch (values.type.value) {
    case 'chatBlock':
    case 'chatUnblock':
      return values.lockChat
    case 'startStream':
    case 'stopStream':
      return values.startStopWebinar ? 'startStream' : 'stopStream'
    default:
      return values.type.value
    }
  }

  const formik = useFormik({
    initialValues: {
      type: { value: '', label: '' },
      userName: '',
      content: '',
      role: { value: '', label: '' },
      hours: '',
      minutes: '',
      seconds: '',
      ms: '',
      bannerName: '',
      urlImageBanner: '',
      hrefBanner: '',
      lockChat: '',
      presentationPage: '',
      startStopWebinar: '',
      webinarLayout: '',
      bannerId: ''
    },
    validationSchema: Yup.mixed().concat(validationSchema).concat(validationSchemaTimeshift),
    onSubmit: (values, { resetForm }) => {
      if (isEdit) {
        const data = {
          timeshift: getTimeshift(values),
          action: getActionType(values),
          payload: getPayload(getActionType(values), values)
        }
        dispatch(updateCommand(params.roomId, props.singleCommand.id, data))
      } else {
        createScenarioCommand(values)
      }
      props.setShowPopUpCreateOrEdit(false)
      resetForm()
      props.setSingleCommand(undefined)
    }
  })

  const createScenarioCommand = (values) => {
    const timeshift = getTimeshift(values) ? getTimeshift(values) : 1
    const newCommand = {
      timeshift: timeshift,
      action: getActionType(values),
      payload: getPayload(getActionType(values), values)
    }
    dispatch(createCommand(params.roomId, newCommand))
    if (!(scenarioSelector && scenarioSelector.length)) {
      dispatch(createCommand(params.roomId, {
        timeshift: 0,
        action: 'startRecord',
        payload: getPayload('startRecord')
      }))
      dispatch(createCommand(params.roomId, {
        timeshift: timeshift + 1,
        action: 'stopRecord',
        payload: getPayload('stopRecord')
      }))
    }

  }

  const listTypeCommandData = [
    { value: 'postMessage', label: 'Сообщение в чат' },
    { value: 'postBanner', label: 'Баннер в чат' },
    { value: 'startStream', label: 'Трансляция (YouTube)' },
    { value: 'stopStream', label: 'Трансляция (YouTube)' },
    { value: 'chatBlock', label: 'Блокировка чата' },
    { value: 'chatUnblock', label: 'Блокировка чата' },
    { value: 'setWebinarLayout', label: 'Расположение видео и презентации' },
    { value: 'setCurrentSlide', label: 'Номер слайда' }
  ]

  const listRoleUserMessage = [
    { value: 'guest', label: 'Участник' },
    { value: 'admin', label: 'Администратор' }
  ]



  const setField = (action) => {
    const time = msToTime(props.singleCommand.timeshift)
    formik.setFieldValue('hours', time.hours)
    formik.setFieldValue('minutes', time.minutes)
    formik.setFieldValue('seconds', time.seconds)
    formik.setFieldValue('ms', time.milliseconds)
    const payload = JSON.parse(props.singleCommand.payload)

    switch (action) {
    case 'postMessage':
      formik.setFieldValue('userName', payload.username)
      formik.setFieldValue('content', payload.message)
      formik.setFieldValue('role', {
        value: payload.role,
        label: listRoleUserMessage.find((type) => type.value === payload.role).label
      })
      break
    case 'setWebinarLayout':
      formik.setFieldValue('webinarLayout', payload.layout)
      break
    case 'setCurrentSlide':
      formik.setFieldValue('presentationPage', payload.page)
      break
    case 'startStream':
      formik.setFieldValue('startStopWebinar', payload.url)
      break
    case 'stopStream':
      formik.setFieldValue('startStopWebinar', '')
      break
    case 'chatUnblock':
      formik.setFieldValue('lockChat', 'chatUnblock')
      break
    case 'chatBlock':
      formik.setFieldValue('lockChat', 'chatBlock')
      break
    case 'postBanner':
      formik.setFieldValue('bannerId', payload.id)
      break
    }
  }

  useEffect(() => {
    if (isEdit && props.singleCommand && props.singleCommand.action !== 'stopRecord') {
      formik.setFieldValue('type', {
        value: props.singleCommand.action,
        label: listTypeCommandData.find((type) => type.value === props.singleCommand.action).label
      })
      setField(props.singleCommand.action)
    } else {
      formik.resetForm()
    }
  }, [props.singleCommand])

  const getBannersList = () => banners.map(banner => {
    return {
      value: banner.id,
      label: `${banner.id}: ${banner.title}`
    }
  }
  )

  const getFields = () => {
    switch (formik.values.type.value) {
    case 'postMessage':
      return (
        <>
          <InputIcon
            name="userName"
            title={true}
            titleText="Имя пользователя"
            placeholder="Имя пользователя"
            className="scenario_content_popup_add_room_custom_input"
            icon={CloseIcon}
            value={formik.values.userName}
            onChange={formik.handleChange}
            onClickIcon={() => formik.setFieldValue('userName', '')}
          />
          <InputIcon
            name="content"
            title={true}
            titleText="Содержимое"
            placeholder="Его сообщение"
            className="scenario_content_popup_add_room_custom_input"
            icon={CloseIcon}
            value={formik.values.content}
            onChange={formik.handleChange}
            onClickIcon={() => formik.setFieldValue('content', '')}
          />
          <Select
            title="Роль"
            list={listRoleUserMessage}
            value={formik.values.role.label}
            onChange={(option) => formik.setFieldValue('role', option)}
          />
        </>
      )
    case 'postBanner':
      return (
        <Select
          title="Баннер"
          list={getBannersList()}
          value={formik.values.bannerId}
          onChange={(option) => formik.setFieldValue('bannerId', option.value)}
        />
      )
    case 'banner':
      return (
        <>
          <InputIcon
            name="bannerName"
            title={true}
            titleText="Название баннера"
            placeholder="Название баннера"
            className="scenario_content_popup_add_room_custom_input"
            icon={CloseIcon}
            value={formik.values.bannerName}
            onChange={formik.handleChange}
            onClickIcon={() => formik.setFieldValue('bannerName', '')}
          />
          <InputIcon
            name="urlImageBanner"
            title={true}
            titleText="Изображение"
            placeholder="Ссылка на изображение"
            className="scenario_content_popup_add_room_custom_input"
            icon={CloseIcon}
            value={formik.values.urlImageBanner}
            onChange={formik.handleChange}
            onClickIcon={() => formik.setFieldValue('urlImageBanner', '')}
          />
          <InputIcon
            name="hrefBanner"
            title={true}
            titleText="Целевая страница"
            placeholder="Ссылка на целевую страницу"
            className="scenario_content_popup_add_room_custom_input"
            icon={CloseIcon}
            value={formik.values.hrefBanner}
            onChange={formik.handleChange}
            onClickIcon={() => formik.setFieldValue('hrefBanner', '')}
          />
        </>
      )
    case 'setWebinarLayout':
      return (
        <>
          <div className="scenario_content_popup_subtitle">Вид трансляции</div>
          <RadioButton
            controll={true}
            selected={formik.values.webinarLayout === 'center'}
            onSelect={() => formik.setFieldValue('webinarLayout', 'center')}
            label="Только трансляция"
          />
          <RadioButton
            controll={true}
            selected={formik.values.webinarLayout === 'top-left'}
            onSelect={() => formik.setFieldValue('webinarLayout', 'top-left')}
            label="Презентация + видео в левом верхнем углу"
          />
          <RadioButton
            controll={true}
            selected={formik.values.webinarLayout === 'top-right'}
            onSelect={() => formik.setFieldValue('webinarLayout', 'top-right')}
            label="Презентация + видео в правом верхнем углу"
          />
          <RadioButton
            controll={true}
            selected={formik.values.webinarLayout === 'bottom-right'}
            onSelect={() => formik.setFieldValue('webinarLayout', 'bottom-right')}
            label="Презентация + видео в правом нижнем углу"
          />
        </>
      )
    case 'chatBlock':
    case 'chatUnblock':
      return (
        <>
          <div className="scenario_content_popup_subtitle">Состояние</div>
          <RadioButton
            controll={true}
            selected={formik.values.lockChat === 'chatUnblock'}
            onSelect={() => formik.setFieldValue('lockChat', 'chatUnblock')}
            label="Разблокирован"
          />
          <RadioButton
            controll={true}
            selected={formik.values.lockChat === 'chatBlock'}
            onSelect={() => formik.setFieldValue('lockChat', 'chatBlock')}
            label="Заблокирован"
          />
        </>
      )
    case 'setCurrentSlide':
      return (
        <div className="input_ui_main">
          <div className="input_ui_title">Номер слайда</div>
          <div className="scenario_content_popup_timeshift_list">
            <input
              name="presentationPage"
              placeholder="№"
              value={formik.values.presentationPage}
              pattern="^\d*"
              onChange={formik.handleChange}
              className="input_ui_input"/>
          </div>
        </div>
      )
    case 'startStream':
    case 'stopStream':
      return (
        <>
          <RadioButton
            controll={true}
            selected={!formik.values.startStopWebinar}
            onSelect={() => formik.setFieldValue('startStopWebinar', '')}
            label="Выключить"
          />
          <RadioButton
            controll={true}
            selected={!!formik.values.startStopWebinar}
            onSelect={() => formik.setFieldValue('startStopWebinar', room.video_src)}
            label="YouTube"
          />
          <div className="scenario_content_popup_add_room_error_label">
            {room.video_src ? '' : 'Для того, что бы включить трансляцию, заполните данное поле в настройках комнаты'}
          </div>
        </>
      )
    default:
      return <></>
    }
  }

  const clearForm = () => {
    props.setShowPopUpCreateOrEdit(false)
    props.setSingleCommand(undefined)
  }

  return (
    <PopUp
      show={props.showPopUpCreateOrEdit}
      closePopUp={clearForm}
      title={isEdit ? 'Изменение команды' : 'Добавление команды'}
      showButtonAccept={false}
      showButtonCancel={false}
    >
      {props.showPopUpCreateOrEdit && <form className="scenario_content_popup_add_room" onSubmit={formik.handleSubmit}>
        <Select
          title="Тип"
          list={listTypeCommandData.filter(data => data.value !== 'chatUnblock' && data.value !== 'stopStream')}
          value={formik.values.type.label}
          onChange={(option) => formik.setFieldValue('type', option)}
        />
        {getFields()}

        <div className="input_ui_main">
          <div className="input_ui_title">Тайминг (<span style={{ textTransform: 'none' }}>время от начала записи вебинара</span>)</div>
          {formik.values.type.value
            ? <TimeshiftInputsForm formik={formik} /> : null}
        </div>
        <div className="popup_ui_window_buttons_list">
          <Button
            type="submit"
            size="medium"
            color="blue"
            disabled={!!Object.keys(formik.errors).length || !formik.values.type?.value}
            onClick={null}
          >
            {isEdit ? 'Изменить' : 'Создать'}
          </Button>
          <ButtonBorder
            type="button"
            size="medium"
            color="blue"
            onClick={clearForm}
          >
            Отмена
          </ButtonBorder>
        </div>
      </form>}
    </PopUp>
  )
}

PopUpCreateOrEditCommand.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  showPopUpCreateOrEdit: PropTypes.bool,
  setShowPopUpCreateOrEdit: PropTypes.func.isRequired,
  singleCommand: PropTypes.shape({
    id: PropTypes.number.isRequired,
    action: PropTypes.string.isRequired,
    username: PropTypes.string,
    timeshift: PropTypes.number.isRequired,
    payload: PropTypes.string
  }),
  setSingleCommand: PropTypes.func
}

export default PopUpCreateOrEditCommand
