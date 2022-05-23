import React, { useEffect, useState } from 'react'
import './LoadJsonScript.scss'
import PropTypes from 'prop-types'
import PopUp from '../UI/PopUp'
import { getAdminRoom } from '../../lib/admin/rooms/actions'
import { roomSetScenario } from '../../lib/admin/scenario/actions'
import { alertbarShow } from '../../lib/app/alertbar/actions'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

const LoadJsonScript = (props) => {
  const params = useParams()
  const dispatch = useDispatch()
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])
  const [errorMessage, setErrorMessage] = useState('')
  const [showPopUpError, setShowPopUpError] = useState(false)

  useEffect(() => {
    if (!room) {
      dispatch(getAdminRoom(params.roomId))
    }
  }, [dispatch, params.roomId, room])

  const loadJson = (e) => {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0]
    if (!file) {
      return
    }
    if (file.type === 'application/json') {
      reader.readAsText(file)
      reader.onloadend = () => {
        const result = JSON.parse(reader.result.toString())
        const commandPresentation = result.data.find(command => command.action === 'presentationName')
        const commandGoOnline = result.data.find(command => command.action === 'goOnline')
        if (room.presentation) {
          if (commandPresentation && commandPresentation.data !== room.presentation.name) {
            setErrorMessage('Ошибка совпадения презентаций комнаты и сценария')
            setShowPopUpError(true)
            return
          }
        } else {
          if (commandPresentation) {
            setErrorMessage('В комнате отсутствует презентация, указанная в сценарии')
            setShowPopUpError(true)
            return
          }
        }
        if (commandGoOnline && !commandGoOnline.data.url.includes('youtube.com')) {
          setErrorMessage('Стрим должен производиться из YouTube')
          setShowPopUpError(true)
          return
        }

        dispatch(roomSetScenario(room.id, file)).then(() => {
          dispatch(getAdminRoom(params.roomId))
        })

        document.getElementById(props.id).value = ''
      }
    } else {
      dispatch(alertbarShow({ type: 'error', messages: ['Неверный формат файла'] }))
    }
  }

  return (
    <>
      <input style={{ display: 'none' }} type="file" id={props.id} accept="application/json" onChange={loadJson} />
      <PopUp
        showButtonAccept={true}
        showButtonCancel={false}
        buttonAcceptLabel={'Закрыть'}
        title={'Ошибка загрузки сценария'}
        onAccept={() => setShowPopUpError(false)}
        show={showPopUpError}
        closePopUp={() => setShowPopUpError(false)}
      >
        <div className="popup_error_download_script">{errorMessage}</div>
      </PopUp>
    </>
  )
}

LoadJsonScript.propTypes = {
  id: PropTypes.string.isRequired
}

export default LoadJsonScript
