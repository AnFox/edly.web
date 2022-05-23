import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './UserHeader.scss'
import '../CommonStyles/CommonStylesWebinar.scss'
import { CloseIcon, OutIcon } from '../UI/Icons/Icons'

const UserHeader = (props) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <div
        style={{ display: showMenu ? 'block' : 'none' }}
        className="menu_fon"
        onClick={() => setShowMenu(false)}
      >
      </div>
      <div className="menu_mobile" id="menu_mob" style={{ right: showMenu ? '0px' : '-310px' }}>
        <div className="menu_mobile_header">
          <span>{props.user.first_name}</span>
          <CloseIcon className="icon" onClick={() => setShowMenu(false)} />
        </div>
        <div className="out_room_mobile" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link style={{ marginRight: '10px', fontWeight: 'bold', textDecoration: 'none' }} className="btn_back_to_rooms" to="/webinars">
            <svg width="7" height="14" viewBox="0 0 7 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="back_to_room_icon_patch" d="M6.82968 15C6.68028 15.0005 6.53267 14.9675 6.39769 14.9035C6.26271 14.8395 6.14379 14.746 6.04968 14.63L1.21968 8.63C1.07259 8.45107 0.992188 8.22662 0.992188 7.995C0.992188 7.76337 1.07259 7.53893 1.21968 7.36L6.21968 1.36C6.38941 1.15578 6.63333 1.02736 6.89775 1.00298C7.16218 0.9786 7.42546 1.06026 7.62968 1.23C7.83389 1.39974 7.96232 1.64365 7.9867 1.90808C8.01108 2.1725 7.92941 2.43578 7.75968 2.64L3.28968 8L7.60967 13.36C7.73196 13.5068 7.80964 13.6855 7.83351 13.8751C7.85739 14.0646 7.82648 14.257 7.74442 14.4296C7.66237 14.6021 7.53261 14.7475 7.3705 14.8486C7.20838 14.9497 7.02071 15.0022 6.82968 15Z" fill="#222B45"/>
            </svg>
            <span style={{ marginLeft: '9px' }}>Вебинары</span>
          </Link>
          <button
            className="room_header_btn_out"
            onClick={props.authLogout}
          >
              Выйти
          </button>
          <OutIcon className="room_header_icon" />
        </div>
        <div className="authform_line menu_mobile_line" />
        <div className="menu_mobile_help_btn">
          <button className="btn_border btn_chat_help_admin" onClick={() => props.openHelp(true)}>Помощь</button>
        </div>
      </div>
      <div className="room_header room_header_user" id="webinar_header">
        <Link className="btn_back_to_rooms" style={{ textDecoration: 'none' }} to="/webinars">
          <svg width="7" height="14" viewBox="0 0 7 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="back_to_room_icon_patch" d="M6.82968 15C6.68028 15.0005 6.53267 14.9675 6.39769 14.9035C6.26271 14.8395 6.14379 14.746 6.04968 14.63L1.21968 8.63C1.07259 8.45107 0.992188 8.22662 0.992188 7.995C0.992188 7.76337 1.07259 7.53893 1.21968 7.36L6.21968 1.36C6.38941 1.15578 6.63333 1.02736 6.89775 1.00298C7.16218 0.9786 7.42546 1.06026 7.62968 1.23C7.83389 1.39974 7.96232 1.64365 7.9867 1.90808C8.01108 2.1725 7.92941 2.43578 7.75968 2.64L3.28968 8L7.60967 13.36C7.73196 13.5068 7.80964 13.6855 7.83351 13.8751C7.85739 14.0646 7.82648 14.257 7.74442 14.4296C7.66237 14.6021 7.53261 14.7475 7.3705 14.8486C7.20838 14.9497 7.02071 15.0022 6.82968 15Z" fill="#222B45"/>
          </svg>
          <span style={{ marginLeft: '9px' }}>Вебинары</span>
        </Link>
        <span className="webinar_header_title">
          {props.webinar.name}
        </span>
        <div className="menu_button_mobile" onClick={() => setShowMenu(true)}>
          <svg className="menu_icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="menu_icon_path" d="M26.7333 14.6667H5.26667C4.56711 14.6667 4 15.2338 4 15.9333V16.0667C4 16.7662 4.56711 17.3333 5.26667 17.3333H26.7333C27.4329 17.3333 28 16.7662 28 16.0667V15.9333C28 15.2338 27.4329 14.6667 26.7333 14.6667Z" fill="#222B45"/>
            <path className="menu_icon_path" d="M26.7333 21.3333H5.26667C4.56711 21.3333 4 21.9004 4 22.6V22.7333C4 23.4329 4.56711 24 5.26667 24H26.7333C27.4329 24 28 23.4329 28 22.7333V22.6C28 21.9004 27.4329 21.3333 26.7333 21.3333Z" fill="#222B45"/>
            <path className="menu_icon_path" d="M26.7333 8H5.26667C4.56711 8 4 8.56711 4 9.26667V9.4C4 10.0996 4.56711 10.6667 5.26667 10.6667H26.7333C27.4329 10.6667 28 10.0996 28 9.4V9.26667C28 8.56711 27.4329 8 26.7333 8Z" fill="#222B45"/>
          </svg>
        </div>
        <div className="room_header_info_and_btn">
          <strong>{props.user.first_name}</strong>
          <div className="out_room">
            <button
              className="room_header_btn_out"
              onClick={props.authLogout}
            >
              Выйти
            </button>
            <OutIcon className="room_header_icon" />
          </div>

        </div>

      </div>
    </>
  )
}

UserHeader.propTypes = {
  authLogout: PropTypes.func.isRequired,
  webinar: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  openHelp: PropTypes.func.isRequired
}

export default UserHeader
