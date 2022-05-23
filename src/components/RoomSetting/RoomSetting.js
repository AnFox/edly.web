import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Common from './Common'
import Stream from './Stream'
import Presentation from './Presentation'
import Chat from './Chat'
import Other from './Other'
import 'react-datepicker/dist/react-datepicker.css'
import {
  getAdminRoom, getAdminRooms,
  updateRoom
} from '../../lib/admin/rooms/actions'

import { useParams, useLocation } from 'react-router-dom'
import './RoomSetting.scss'
import Banner from './Banner'
import { getScenario } from '../../lib/admin/scenario/actions'
import TabBar from '../UI/TabBar'

const RoomSetting = (props) => {
  const words = {
    save: props.optionWindow === 'webinar'
      ? 'Сохранить изменения'
      : 'Сохранить',
    back: props.optionWindow === 'webinar' ? 'Свернуть' : 'Закрыть',
    copyURL: 'Скопировать в буфер',
    bannerSave: 'Сохранить изменения',
    bannerDelete: 'Удалить',
    presentation: {
      buttonDownload: 'Загрузить презентацию (PDF)',
      emptyPresentation: 'Вы еще не загрузили ни одной презентации.',
      slides: 'Слайдов',
      popUpAddPresentation: {
        title: 'Выбор файла',
        qualityOfConversion: 'качество конвертации слайдов',
        standard: 'Стандарт',
        standartSubtitle: 'рекомендуется',
        better: 'Улучшено',
        betterSubtitle: 'больше размер файлов',
        maximum: 'Максимум',
        maximumSubtitle: 'наибольший размер файлов',
        buttonCancel: 'Отмена',
        dragAndDrop: 'Перетащите сюда файл либо нажмите для его выбора',
        dragAndDropActive: 'Отпустите'
      },
      popUpDeletePresentation: {
        title: 'Подтвердите',
        subtitle: 'Вы собираетесь удалить презентацию - ',
        buttonAccept: 'Удалить',
        buttonCancel: 'Отмена'
      }
    }
  }
  const dispatch = useDispatch()
  const params = useParams()
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])
  const webinar = useSelector(state => state.app.webinar[props.webinarId])
  const scenario = useSelector(state => state.admin.scenario[params.roomId])

  const [roomState, setRoomState] = useState()

  const location = useLocation()
  const rooms = useSelector(state => state.admin.rooms.rooms)
  const [menuOption, setMenuOption] = useState('Common')
  const [isSaveSetting, setIsSaveSetting] = useState(false)

  useEffect(() => {
    if (!rooms.length) {
      dispatch(getAdminRooms())
    }
  }, [dispatch, rooms])

  const getRoom = useCallback(() => {
    if (params.roomId) {
      dispatch(getAdminRoom(params.roomId))
    } else {
      if (webinar && webinar.room_id) {
        dispatch(getAdminRoom(webinar.room_id))
      }
    }
  }, [dispatch, params.roomId, webinar])

  useEffect(() => {
    getRoom()
    // return () => dispatch(clearRoom(params.roomId))
  }, [dispatch, getRoom, params.roomId])

  useEffect(() => {
    if (room) {
      setRoomState(room)
      if (!scenario && room.id) {
        dispatch(getScenario(room.id))
      }
    }
  }, [dispatch, room, scenario])


  useEffect(() => {
    if (location && location.state && location.state.tab) {
      setMenuOption(location.state.tab)
    }
  }, [location])

  const saveRoom = (webinar) => {
    const tempRoom = {
      ...roomState,
      ...webinar,
      is_bot_assign_required: webinar.is_bot_assign_required ?? !!roomState.is_bot_assign_required
    }
    dispatch(updateRoom(tempRoom.id, tempRoom)).then(() => {
      setIsSaveSetting(true)
      setTimeout(() => setIsSaveSetting(false), 5000)
    })
  }

  const saveRoomCommon = (values) => {
    const intWebinarDuration = (+values.hours * 60) + +values.minutes
    const data = {
      bot_url_telegram: values.urlTelegram ? values.urlTelegram.includes('https://') ? values.urlTelegram : 'https://' + values.urlTelegram : values.urlTelegram,
      bot_url_whatsapp: values.urlWhatsApp ? values.urlWhatsApp.includes('https://') ? values.urlWhatsApp : 'https://' + values.urlWhatsApp : values.urlWhatsApp,
      bot_url_viber: values.urlViber ? values.urlViber.includes('https://') ? values.urlViber : 'https://' + values.urlViber : values.urlViber,
      name: values.nameRoom,
      is_bot_assign_required: values.isBotAssignRequired,
      description: values.roomDescription,
      duration_minutes: intWebinarDuration,
      starts_at: values.dateStart ? new Date(values.dateStart).toUTCString() : null
    }
    saveRoom(data)
  }

  const saveRoomStream = (values) => {
    // Настройки, Трансляция, кнопка "Сохранить изменения"
    let data = {
      video_src: values.videoSrc,
      type_id: values.typeStream,
      request_record: values.requestRecord
    }
    let scheduled
    if (values.scheduleInterval === room.schedule_interval && values.scheduledAt === room.scheduled_at) {
      scheduled = {
        schedule_interval : undefined,
        scheduled_at: undefined
      }
    } else {
      scheduled = {
        schedule_interval : values.scheduleInterval,
        scheduled_at: values.scheduledAt
      }
    }
    saveRoom({ ...data, ...scheduled })
  }

  const saveRoomChat = () => {
    // Настройки, Чат, кнопка "Сохранить изменения"
    saveRoom()
  }

  const saveRoomOther = (values) => {
    // Настройки, Разное, кнопка "Сохранить изменения"
    const data = {
      waiting_text: values.waitingText,
      post_webinar_text: values.postWebinarText
    }
    saveRoom(data)
  }

  const rollUp = () => {
    if (props.optionWindow === 'webinar') {
      props.showSetting(false)
    }
  }

  return (
    <div className={props.optionWindow === 'webinar' ? 'admin_header_setting_window' : 'edit_room_setting'} id="setting_window">
      <TabBar
        setMenuOption={setMenuOption}
        menuOption={menuOption}
        className={props.optionWindow === 'webinar' ? 'admin_header_setting_window_menu' : ''}
        values={['Common', 'Stream', 'Presentation', 'Chat', 'Banners', 'Other']}
        closeIcon={props.optionWindow === 'webinar'}
        onClose={props.showSetting}
      >
        {'Общие'}
        {'Трансляция'}
        {'Презентация'}
        {'Чат'}
        {'Баннер'}
        {'Разное'}
      </TabBar>
      {props.optionWindow === 'webinar' && <div className={'menu_item_line'}/>}
      {menuOption === 'Common' && (
        <Common
          text={words}
          rollUp={rollUp}
          saveCommonSetting={saveRoomCommon}
          roomObject={roomState}
          webinarLocation={props.optionWindow === 'webinar'}
          saveSuccess={isSaveSetting}
          webinarId={props.webinarId}
        />
      )}
      {menuOption === 'Stream' && (
        <Stream
          text={words}
          rollUp={rollUp}
          saveStreamSetting={saveRoomStream}
          roomObject={roomState}
          webinarLocation={props.optionWindow === 'webinar'}
          saveSuccess={isSaveSetting}
        />
      )}
      {menuOption === 'Presentation' && (
        <Presentation
          text={words}
          saveChatSetting={saveRoomChat}
          rollUp={rollUp}
          webinarLocation={props.optionWindow === 'webinar'}
        />
      )}
      {menuOption === 'Chat' && (
        <Chat
          text={words}
          room={roomState}
          saveChatSetting={saveRoomChat}
          rollUp={rollUp}
          webinarLocation={props.optionWindow === 'webinar'}
        />
      )}
      {menuOption === 'Banners' && (
        <Banner
          rollUp={rollUp}
          text={words}
          webinarLocation={props.optionWindow === 'webinar'}
        />
      )}
      {menuOption === 'Other' && (
        <Other
          rollUp={rollUp}
          saveOtherSetting={saveRoomOther}
          text={words}
          roomState={roomState}
          saveSuccess={isSaveSetting}
        />
      )}
    </div>
  )
}

RoomSetting.propTypes = {
  optionWindow: PropTypes.string.isRequired,
  showSetting: PropTypes.func,
  webinarId: PropTypes.number
}

export default RoomSetting
