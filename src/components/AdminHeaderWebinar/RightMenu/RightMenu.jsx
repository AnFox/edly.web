import React from 'react'
import PropTypes from 'prop-types'
import {
  ArrowDown,
  ArrowUp,
  CameraBottomRight,
  CameraOnlyStream,
  CameraTopLeft,
  CameraTopRight,
  Refresh,
  Volume,
  YouTube,
  CloseIcon,
  Setting,
  ArrowOut,
  ArrowLeft,
  CursorTypeOne,
  Unlock,
  Ellipsis
} from '../../UI/Icons/Icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from '../../UI/Button'
import { WebinarTypeTabsInChat } from '../../../dict/webinar'

const RightMenu = (props) => {
  const user = useSelector(state => state.app.user)
  const webinar = useSelector(state => state.app.webinar[props.webinarId] || {})

  return(
    <>
      <div className="menu_mobile admin_menu_mobile" style={{ right: props.showMenu ? '0px' : '-310px' }}>
        <div className="menu_mobile_header">
          <span>{user.first_name}</span>
          <CloseIcon className="icon" onClick={() => props.setShowMenu(false)} />
        </div>
        {!webinar.finished_at
      && <div className="admin_menu_mobile_line">
        <div className="btn-primary admin_room_btn btn_setting"
          onClick={() => props.showSetting(true)}>
          <Setting className="room_header_setting_icon" />
          Настройки
        </div>
      </div>}
        {!webinar.finished_at && <div className="admin_menu_mobile_line">
          {props.webinarStartStopControl()}
        </div>}
        <div className="admin_menu_mobile_line list_icons">

          <Volume className="icon btn_volume"/>
          <div className="admin_room_header_camera" onClick={() => webinar.presentation ? props.setCameraMenu(!props.cameraMenu) : null }>
            {props.getCameraIcon()}
            {props.cameraMenu ? <ArrowUp/> : <ArrowDown/>}
            <div className="admin_room_header_camera_menu" style={{ display: props.cameraMenu ? 'block' : 'none' }}>
              <div className="admin_room_header_camera_menu_btn_mobile" onClick={() => props.changeVideoPosition('video-only')}>
                <CameraOnlyStream />
                <div>Только трансляция</div>
              </div>
              <div className="admin_room_header_camera_menu_btn_mobile" onClick={() => props.changeVideoPosition('top-left')}>
                <CameraTopLeft />
                <span>Презентация + видео в левом верхнем углу</span>
              </div>
              <div className="admin_room_header_camera_menu_btn_mobile" onClick={() => props.changeVideoPosition('top-right')}>
                <CameraTopRight />
                <span>Презентация + видео в правом верхнем углу</span>
              </div>
              <div className="admin_room_header_camera_menu_btn_mobile" onClick={() => props.changeVideoPosition('bottom-right')}>
                <CameraBottomRight />
                <span>Презентация + видео в правом нижнем углу</span>
              </div>
            </div>
          </div>
          <Refresh className="icon btn_refresh" onClick={props.refresh}/>
          <YouTube onClick={props.onYouTube} className="icon btn_youtube"/>
        </div>
        {/* <div className="admin_menu_mobile_line">
          <div className="btn_present"
            onClick={() => choicePresent(true)}>
            Без презентации
            <svg style={{ marginLeft: '7px' }} width="10" height="7"
              viewBox="0 0 10 7" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path className="btn_present_icon_path"
                fillRule="evenodd" clipRule="evenodd"
                d="M5.00025 6.5C4.74425 6.5 4.48825 6.402 4.29325 6.207L0.29325 2.207C-0.09775 1.816 -0.09775 1.184 0.29325 0.792998C0.68425 0.401998 1.31625 0.401998 1.70725 0.792998L5.01225 4.098L8.30525 0.917998C8.70425 0.534998 9.33525 0.545998 9.71925 0.942998C10.1032 1.34 10.0922 1.974 9.69525 2.357L5.69525 6.219C5.50025 6.407 5.25025 6.5 5.00025 6.5Z"
                fill="#222B45"/>
            </svg>
          </div>
        </div> */}
        <div className="admin_menu_mobile_line" style={{ justifyContent: 'space-between' }}>
          <Button onClick={() => props.showMore('.header_clear_and_redirect_mobile')} className="btn_more">
            <Ellipsis className="btn_more_icon" />
          </Button>
          {!webinar.chat_enabled ? (
            <Button size="small" color="green" onClick={() => props.blockChat(false)}>
              <CursorTypeOne />
            Разблокировать чат
            </Button>
          ) : (
            <Button size="small" className="btn_yellow" color="yellow" onClick={() => props.blockChat(true)}>
              <Unlock />
            Заблокировать чат
            </Button>
          )}
          <div className="header_clear_and_redirect_mobile">
            {/*<Button size="small" onClick={() => props.setShowClearChatPopUp(true)}>Очистить чат</Button>*/}
            {/*<Button size="small" onClick={() => props.setRedirectPopUp(true)}>Перенаправить на URL...</Button>*/}
            <Button size="small" onClick={() => props.changeChatTab(WebinarTypeTabsInChat.PRODUCTS, '.header_clear_and_redirect_mobile')}>Переключить на товары</Button>
          </div>
        </div>

        <div className="admin_menu_mobile_line menu_mobile_help">
          <button className="btn_border btn_chat_help_admin" onClick={() => props.openHelp(true)}>
          Помощь
          </button>
        </div>
        <div className="authform_line menu_mobile_line"
          style={{ margin: '0', marginTop: '10px' }}/>
        <div className="admin_menu_mobile_line">
          <Link className="btn_back_to_rooms" style={{ textDecoration: 'none' }} to="/rooms">
            <ArrowLeft/>
            <span>Комнаты</span>
          </Link>
        </div>
        <div className="admin_menu_mobile_line">
          <div className="admin_out_room_mobile" onClick={props.outRoom}>
            <ArrowOut />
            <button className="room_header_btn_out">
            Выйти
            </button>
          </div>
        </div>

      </div>
      <div className="menu_mobile_fon" id="fon_mob"
        style={{ display: props.showMenu ? 'block' : 'none' }}
        onClick={() => props.setShowMenu(false)}/>
      <div
        className="menu_mobile_fon fon_z_index"
        id="fon_mob_setting"
        onClick={() => props.showSetting(false)}
      />
    </>
  )
}
RightMenu.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  setShowMenu: PropTypes.func.isRequired,
  webinarStartStopControl: PropTypes.func.isRequired,
  outRoom: PropTypes.func.isRequired,
  openHelp: PropTypes.func,
  showSetting: PropTypes.func.isRequired,
  setCameraMenu: PropTypes.func.isRequired,
  cameraMenu: PropTypes.bool.isRequired,
  getCameraIcon: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  changeVideoPosition: PropTypes.func.isRequired,
  onYouTube: PropTypes.func.isRequired,
  blockChat: PropTypes.func.isRequired,
  setShowClearChatPopUp: PropTypes.func.isRequired,
  setRedirectPopUp: PropTypes.func.isRequired,
  showMore: PropTypes.func,
  changeChatTab: PropTypes.func,
  webinarId: PropTypes.number.isRequired
}

export default RightMenu
