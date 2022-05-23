import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Common from './WebinarSettingCommon'
import 'react-datepicker/dist/react-datepicker.css'

import { useParams } from 'react-router-dom'
import './WebinarSetting.scss'
import { getWebinarOwner, updateWebinar } from '../../lib/admin/webinars/actions'

const text = {
  saveBtn: 'Сохранить',
  cancelBtn: 'Закрыть'
}

const WebinarSetting = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const webinar = useSelector(state => state.admin.webinars.currentWebinar[params.webinarId])

  useEffect(() => {
    dispatch(getWebinarOwner(params.webinarId))
  }, [dispatch, params.webinarId])

  const [menuOption, setMenuOption] = useState('Common')
  const [isSaveSetting, setIsSaveSetting] = useState(false)

  const saveAllObjectWebinar = (data) => {
    const webinarData = {
      ...webinar,
      ...data
    }
    dispatch(updateWebinar(webinarData.id, webinarData)).then(() => {
      setIsSaveSetting(true)
      setTimeout(() => setIsSaveSetting(false), 5000)
    })
  }
  const saveCommonSetting = (values) => {
    const data = {
      starts_at: values.dateStart ? new Date(values.dateStart).toUTCString() : null,
      is_recordable: !!values.is_recordable
    }
    saveAllObjectWebinar(data)
  }

  return (
    <div className={'edit_webinar'} id="setting_window">
      <div className={'edit_webinar_menu'}>
        <div onClick={() => setMenuOption('Common')}
          className={`edit_webinar_menu_item ${menuOption === 'Common'
            ? 'edit_webinar_menu_item_selected'
            : ''}`}>
            Общие
        </div>
      </div>
      {menuOption === 'Common' && (
        <Common
          text={text}
          saveCommonSetting={saveCommonSetting}
          saveSuccess={isSaveSetting}
        />
      )}
    </div>
  )
}

export default WebinarSetting
