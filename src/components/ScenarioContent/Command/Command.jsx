import React from 'react'
import './Command.scss'
import {
  Camera,
  WebinarIcon,
  PresentationChange,
  Message,
  Lock,
  Unlock,
  Ellipsis,
  CornerArrow,
  Img,
  Film
} from '../../UI/Icons/Icons'
import { msToTime, toReadTime } from '../../../utils/msToTime'
import PropTypes from 'prop-types'

const getIcon = (action) => {
  switch (action) {
  case 'stopStream':
  case 'startStream':
    return <Camera className="command_type_icon" />
  case 'startRecord':
  case 'stopRecord':
    return <Film className="command_type_icon" />
  case 'setWebinarLayout':
    return <WebinarIcon className="command_type_icon" />
  case 'setCurrentSlide':
    return <PresentationChange className="command_type_icon" />
  case 'postMessage':
    return <Message className="command_type_icon" />
  case 'chatBlock':
    return <Lock className="command_type_icon" />
  case 'chatUnblock':
    return <Unlock className="command_type_icon" />
  case 'postBanner':
    return <Img className="command_type_icon" />
  default:
    return '?'
  }
}

const getLayout = (commandPayload) => {
  const payload = JSON.parse(commandPayload)
  switch (payload.layout) {
  case 'center':
    return 'Только трансляция'
  case 'top-left':
    return 'Презентация + видео в левом верхнем углу'
  case 'top-right':
    return 'Презентация + видео в правом верхнем углу'
  case 'bottom-right':
    return 'Презентация + видео в правом нижнем углу'
  }
}

const getMessageIntoJson = (commandJson) => {
  const command = JSON.parse(commandJson)
  return <div><span>{`${command.username}: ${command.role === 'admin' ? '[модератор] ' : ''}`}</span><span style={{ fontWeight: 'normal' }}>{command.message}</span></div>
}

const getContent = (command) => {
  switch (command.action) {
  case 'setWebinarLayout':
    return getLayout(command.payload)
  case 'setCurrentSlide':
    return (
      <div>
        <div>Слайд {JSON.parse(command.payload).page}</div>
        <div className="command_info_presentation_page" />
      </div>
    )
  case 'startStream':
    return (
      <div>
        <div>Трансляция включена</div>
        <div className="command_info_go_online" />
      </div>
    )
  case 'stopStream':
    return 'Трансляция выключена'
  case 'postMessage':
    return getMessageIntoJson(command.payload)
  case 'chatBlock':
    return 'Чат заблокирован'
  case 'chatUnblock':
    return 'Чат разблокирован'
  case 'postBanner':
    return 'Баннер отправлен'
  case 'startRecord':
    return JSON.parse(command.payload)?.text || 'Начало записи'
  case 'stopRecord':
    return JSON.parse(command.payload)?.text || 'Конец записи'
  default:
    return <>?</>
  }
}

const Command = (props) => {
  const time = msToTime(props.command.timeshift)
  const readableTime = toReadTime(time)
  const changeCommand = () => {
    if (!props.isShowPreview) {
      props.changeCommand(props.command.id, props.index)
    }
  }

  const changeMoreMenu = (e, i) => {
    e.stopPropagation()
    const doc = document.getElementById(`command_more_${i}`)
    if (doc.style.display !== 'block') {
      doc.style.display = 'block'
      doc.focus()
    } else {
      doc.style.display = 'none'
    }
  }

  const changeMoreMenuBlur = (i) => {
    const doc = document.getElementById(`command_more_${i}`)
    doc.style.display = 'none'
  }

  const editCommand = (e) => {
    e.stopPropagation()
    props.editCommand(props.command)
  }

  const deleteCommand = (e) => {
    e.stopPropagation()
    props.deleteCommandShow(props.command)
  }

  const isPlayed = () => props.completedCommands.find(command => command.id === props.command.id)

  const isSelected = () => props.selectedCommands.find(command => command.id === props.command.id)

  const isDelete = () => props.command.action !== 'startRecord' && props.command.action !== 'stopRecord'

  const isEdit = () => !props.isShowPreview && props.command.action !== 'startRecord'

  return (
    <div className={`command${isSelected() ? ' command_select' : ''}${isPlayed() ? ' command_played' : ''}`}>
      <div className="command_box">
        <div className="command_time">+{readableTime.hours} ч {readableTime.minutes} мин {readableTime.seconds}.{readableTime.milliseconds} сек</div>
        <CornerArrow className="command_box_arrow" />
        <div className="command_type">{getIcon(props.command.action, props.command.data)}</div>
      </div>
      <div className="command_info" onClick={changeCommand}>
        {getContent(props.command)}
        {isEdit() && <><Ellipsis className="command_info_menu_icon" onClick={(e) => changeMoreMenu(e, props.index)}/>
          <div
            onBlur={() => changeMoreMenuBlur(props.index)}
            className="command_info_more"
            id={`command_more_${props.index}`}
            tabIndex={props.index + 10}
          >
            <div onClick={editCommand}>Изменить команду</div>
            {isDelete() && <div onClick={deleteCommand}>Удалить команду</div>}
          </div></>}
      </div>
    </div>
  )
}

Command.propTypes = {
  command: PropTypes.shape({
    id: PropTypes.number.isRequired,
    selected: PropTypes.bool,
    action: PropTypes.string.isRequired,
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.instanceOf(Object)]),
    timeshift: PropTypes.number.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  changeCommand: PropTypes.func.isRequired,
  editCommand: PropTypes.func.isRequired,
  deleteCommandShow: PropTypes.func.isRequired,
  selectedCommands: PropTypes.array,
  completedCommands: PropTypes.array,
  isShowPreview: PropTypes.bool.isRequired
}

export default Command
