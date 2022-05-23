import React, { useState } from 'react'
import { Link as LinkScroll, animateScroll } from 'react-scroll'
import { Link } from 'react-router-dom'
import './Header.scss'

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false)

  const closeMenu = () => {
    setOpenMenu(false)
  }

  return (
    <header className="landing_header">
      <div className="landing_header_nav_menu">
        <div className="landing_header_nav_menu_logo" onClick={animateScroll.scrollToTop}>EDLY</div>
        <div className="landing_header_nav_menu_href_list">
          <LinkScroll className="landing_header_nav_menu_option"
            activeClass="active"
            to="section_second"
            smooth={true}
            offset={-50}
            duration={500}
          >
            Особенности
          </LinkScroll>
          <LinkScroll className="landing_header_nav_menu_option"
            activeClass="active"
            to="section_third"
            smooth={true}
            offset={-50}
            duration={500}
          >
            Концепция EDLY
          </LinkScroll>
          <LinkScroll className="landing_header_nav_menu_option"
            activeClass="active"
            to="section_fourth"
            smooth={true}
            offset={-50}
            duration={500}
          >
            Оплата и тарифы
          </LinkScroll>
          <Link className="landing_header_nav_menu_option"
            to="/register"
          >
            Регистрация
          </Link>
          <Link className="landing_header_nav_menu_option" to="/login">
            Войти
          </Link>
        </div>
        <svg onClick={() => { setOpenMenu(true); document.getElementById('landing_right_menu').focus() }} className="landing_header_menu_icon" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.15789 2.03735C0.521053 2.03735 0 2.55841 0 3.19525C0 3.83209 0.521053 4.35314 1.15789 4.35314H20.8421C21.4789 4.35314 22 3.83209 22 3.19525C22 2.55841 21.4789 2.03735 20.8421 2.03735H1.15789ZM1.15789 9.85314C0.521053 9.85314 0 10.3742 0 11.011C0 11.6479 0.521053 12.1689 1.15789 12.1689H20.8421C21.4789 12.1689 22 11.6479 22 11.011C22 10.3742 21.4789 9.85314 20.8421 9.85314H1.15789ZM1.15789 17.6689C0.521053 17.6689 0 18.19 0 18.8268C0 19.4637 0.521053 19.9847 1.15789 19.9847H20.8421C21.4789 19.9847 22 19.4637 22 18.8268C22 18.19 21.4789 17.6689 20.8421 17.6689H1.15789Z" fill="black"/>
        </svg>
      </div>

      <div onBlur={closeMenu} id="landing_right_menu" className="landing_header_mobile_menu" style={{ right: `${openMenu ? '0px' : '-300px'}` }} tabIndex={12}>
        <svg onClick={closeMenu} className="landing_header_mobile_menu_close_icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.8799 16L23.6133 10.28C23.8643 10.0289 24.0054 9.6884 24.0054 9.33333C24.0054 8.97827 23.8643 8.63774 23.6133 8.38667C23.3622 8.1356 23.0217 7.99454 22.6666 7.99454C22.3115 7.99454 21.971 8.1356 21.7199 8.38667L15.9999 14.12L10.2799 8.38667C10.0288 8.1356 9.68832 7.99454 9.33325 7.99454C8.97818 7.99454 8.63766 8.1356 8.38659 8.38667C8.13551 8.63774 7.99446 8.97827 7.99446 9.33333C7.99446 9.6884 8.13551 10.0289 8.38659 10.28L14.1199 16L8.38659 21.72C8.26161 21.844 8.16242 21.9914 8.09473 22.1539C8.02704 22.3164 7.99219 22.4907 7.99219 22.6667C7.99219 22.8427 8.02704 23.017 8.09473 23.1794C8.16242 23.3419 8.26161 23.4894 8.38659 23.6133C8.51054 23.7383 8.658 23.8375 8.82048 23.9052C8.98296 23.9729 9.15724 24.0077 9.33325 24.0077C9.50927 24.0077 9.68354 23.9729 9.84602 23.9052C10.0085 23.8375 10.156 23.7383 10.2799 23.6133L15.9999 17.88L21.7199 23.6133C21.8439 23.7383 21.9913 23.8375 22.1538 23.9052C22.3163 23.9729 22.4906 24.0077 22.6666 24.0077C22.8426 24.0077 23.0169 23.9729 23.1794 23.9052C23.3418 23.8375 23.4893 23.7383 23.6133 23.6133C23.7382 23.4894 23.8374 23.3419 23.9051 23.1794C23.9728 23.017 24.0077 22.8427 24.0077 22.6667C24.0077 22.4907 23.9728 22.3164 23.9051 22.1539C23.8374 21.9914 23.7382 21.844 23.6133 21.72L17.8799 16Z" fill="black"/>
        </svg>
        <LinkScroll onClick={closeMenu} className="landing_header_nav_menu_option landing_header_nav_menu_option_right_menu"
          activeClass="active"
          to="section_second"
          smooth={true}
          offset={-50}
          duration={500}
        >
          Особенности
        </LinkScroll>
        <LinkScroll onClick={closeMenu} className="landing_header_nav_menu_option landing_header_nav_menu_option_right_menu"
          activeClass="active"
          to="section_third"
          smooth={true}
          offset={-50}
          duration={500}
        >
          Концепция EDLY
        </LinkScroll>
        <LinkScroll onClick={closeMenu} className="landing_header_nav_menu_option landing_header_nav_menu_option_right_menu"
          activeClass="active"
          to="section_fourth"
          smooth={true}
          offset={-50}
          duration={500}
        >
          Оплата и тарифы
        </LinkScroll>
        <Link onMouseDown={(e) => e.preventDefault()} className="landing_header_nav_menu_option landing_header_nav_menu_option_right_menu"
          to="/register"
        >
          Регистрация
        </Link>
        <Link onMouseDown={(e) => e.preventDefault()} className="landing_header_nav_menu_option" to="/login">
          Войти
        </Link>
      </div>

    </header>
  )
}

export default Header
