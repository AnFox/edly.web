import React from 'react'
import { animateScroll } from 'react-scroll'
import { Link } from 'react-router-dom'
import './FifthScreen.scss'

const FifthScreen = () => {

  return(
    <div className="fifth_screen">
      <div className="section_title_fifth">Регистрация</div>
      <div className="fifth_screen_subtitle">
                Никакой абонентной платы —
                списание пропорционально объёму услуг!
      </div>
      <Link to="/register" className="btn-primary btn_landing">Бесплатная регистрация</Link>
      <div className="landing_btn_up" onClick={animateScroll.scrollToTop}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.0001 15C17.7664 15.0004 17.54 14.9191 17.3601 14.77L12.0001 10.29L6.63006 14.61C6.52778 14.693 6.41008 14.7551 6.28374 14.7925C6.1574 14.8299 6.02491 14.842 5.89388 14.8281C5.76285 14.8142 5.63587 14.7745 5.52024 14.7113C5.4046 14.6481 5.30259 14.5627 5.22006 14.46C5.137 14.3577 5.07497 14.24 5.03754 14.1137C5.0001 13.9873 4.98801 13.8548 5.00195 13.7238C5.01589 13.5928 5.05559 13.4658 5.11876 13.3502C5.18193 13.2345 5.26734 13.1325 5.37006 13.05L11.3701 8.21998C11.549 8.0729 11.7734 7.99249 12.0051 7.99249C12.2367 7.99249 12.4611 8.0729 12.6401 8.21998L18.6401 13.22C18.7413 13.3039 18.825 13.407 18.8864 13.5234C18.9477 13.6397 18.9855 13.767 18.9976 13.898C19.0097 14.029 18.9958 14.1611 18.9568 14.2867C18.9177 14.4123 18.8543 14.5289 18.7701 14.63C18.677 14.7447 18.5597 14.8374 18.4266 14.9013C18.2934 14.9653 18.1478 14.999 18.0001 15Z" fill="#222B45"/>
        </svg>
      </div>
    </div>
  )
}
export default FifthScreen
