import React, { useEffect, useState } from 'react'
import './Header.scss'
import { MenuArrow } from '../UI/Icons/Icons'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import RightMenu from './RigthMenu'
import useScreenInfo from '../../utils/useScreenInfo'
import LeftMenu from './LeftMenu'

const text = {
  popupBalance: 'Пополните счет, функциональность аккаунта ограничена.',
  out: 'Выйти',
  balance: 'Баланс',
  cashBox: 'Касса',
  webinars: 'Вебинары',
  rooms: 'Комнаты',
  deposit: 'Пополнить',
  privateCabinet: 'Личный кабинет'
}
const Header = () => {
  const [openMenu, setOpenMenu] = useState('')
  const screenInfo = useScreenInfo()
  const user = useSelector(state => state.app.user)
  const balance = user.account ? user.account.balance : null

  const history = useHistory()
  const params = useParams()



  useEffect(() => {
    const rooms = document.getElementsByName('header_main_area_nav_menu_rooms')
    const cashbox = document.getElementsByName('header_main_area_nav_menu_cashbox')
    if (params.webinarId || params.roomId || history.location.pathname === '/rooms') {
      for (let i = 0; i < rooms.length; i++) {
        rooms[i].classList.add('header_main_area_nav_menu_option_selected')
      }
      for (let i = 0; i < cashbox.length; i++) {
        cashbox[i].classList.remove('header_main_area_nav_menu_option_selected')
      }
    }
    if (history.location.pathname === '/cashbox' || params.productId) {
      for (let i = 0; i < rooms.length; i++) {
        rooms[i].classList.remove('header_main_area_nav_menu_option_selected')
      }
      for (let i = 0; i < cashbox.length; i++) {
        cashbox[i].classList.add('header_main_area_nav_menu_option_selected')
      }
    }
  }, [history, params.productId, params.roomId, params.webinarId])

  const closeMenu = () => setOpenMenu('')

  if (!user.id) {
    return <></>
  }

  const isOpenNavMenu = () => {
    if (screenInfo.width) {
      return screenInfo.width > 1024 ? true : openMenu === 'LEFT_MENU'
    } else {
      return window.innerWidth > 1024
    }
  }

  return (
    <header className={`header_main${user.owner ? ' header_main--menu' : ''}`}>
      <div
        className={'header_main__overlay'}
        style={{ display: screenInfo.width <= 1024 ? openMenu ? 'block' : 'none' : 'none' }}
        onClick={() => setOpenMenu('')}
      />
      {user.owner && <LeftMenu closeMenu={closeMenu} open={isOpenNavMenu()} />}
      <RightMenu text={text} open={openMenu === 'RIGHT_MENU'} closeMenu={closeMenu} />
      <div className={`header_main_area`}>
        <div className="header_main_logo">
          {user.owner ? <div className={'header_main_logo__nav_btn'}><MenuArrow onClick={() => setOpenMenu('LEFT_MENU')}/><span>EDLY</span></div> : 'EDLY'}
        </div>
        <div className="header_main_area_nav_menu">
          {user.account && (
            <div className="header_main_area_nav_menu_balance">
              {text.balance}:&nbsp;<span style={{ color: balance > 0 ? '#00E096' : '#FF3D71' }}>{balance} <span className="monetary_unit">₽</span></span>
            </div>
          )}
          <div onClick={() => { setOpenMenu('RIGHT_MENU'); document.getElementById('header_main_right_menu').focus() }} className="header_name">
            {user.first_name ? user.first_name[0] : '?'}
          </div>
          {!user.account || balance > 0 ? null : (
            <div className="header_main_popup_balance">
              {text.popupBalance}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
