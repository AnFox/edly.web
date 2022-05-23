import React from 'react'
import './FirstScreen.scss'
import { Link } from 'react-router-dom'
import Icon1 from '../../assets/svg/landing-first-screen-1.svg'
import Icon2 from '../../assets/svg/landing-first-screen-2.svg'
import Icon3 from '../../assets/svg/landing-first-screen-3.svg'
import Icon4 from '../../assets/svg/landing-first-screen-4.svg'

const FirstScreen = () => {

  return(
    <div className="first_screen">
      <div className="icon-1" />
      <div className="first_screen_text">
        <span className="first_screen_subtitle">Вебинарная комната EDLY</span>
        <h1>Выступите онлайн с самой высокой конверсией в продажи</h1>
        <span className="subtitle_footer">Опыт 250 тысяч клиентов, превращенный в инновации</span>
        <div className="first_screen_advantages">
          <div className="first_screen_advantages_option">
            <div className="first_screen_advantages_option_logo">
              <img src={Icon1} alt="" />
            </div>
            <h3 className="first_screen_advantages_option_label"><b>Оплата продуктов не покидая вебинар</b></h3>
          </div>
          <div className="first_screen_advantages_option">
            <div className="first_screen_advantages_option_logo">
              <img src={Icon2} alt="" />
            </div>
            <h3 className="first_screen_advantages_option_label"><b>Баннеры на продукты прямо в чате и поверх видео</b></h3>
          </div>
          <div className="first_screen_advantages_option">
            <div className="first_screen_advantages_option_logo">
              <img src={Icon3} alt="" />
            </div>
            <h3 className="first_screen_advantages_option_label"><b>История чата по каждому вебинару</b></h3>
          </div>
          <div className="first_screen_advantages_option">
            <div className="first_screen_advantages_option_logo">
              <img src={Icon4} alt="" />
            </div>
            <h3 className="first_screen_advantages_option_label"><b>Сохранение вопросов каждого пользователя</b></h3>
          </div>
        </div>
        <Link to="/register" className="btn-primary btn_landing">Бесплатная регистрация</Link>
      </div>
      <div className="webinar_present" />

    </div>
  )
}

export default FirstScreen
