import React from 'react'
import './ThirdScreen.scss'
import icon_1 from '../../assets/svg/landing-third-screen-1.svg'
import icon_2 from '../../assets/svg/landing-third-screen-2.svg'
import icon_3 from '../../assets/svg/landing-third-screen-3.svg'
import icon_4 from '../../assets/svg/landing-third-screen-4.svg'
import icon_5 from '../../assets/svg/landing-third-screen-5.svg'
import icon_6 from '../../assets/svg/landing-third-screen-6.svg'
import icon_7 from '../../assets/svg/landing-third-screen-7.svg'
import icon_8 from '../../assets/svg/landing-third-screen-8.svg'

const ThirdScreen = () => {

  return (
    <div className="third_screen">
      <div className="third_screen_background" />
      <div className="icon-2" />
      <div className="icon-3" />
      <div className="section_title_third">Концепция</div>
      <div className="third_screen_subtitle">В EDLY предусмотрено все, что может понадобиться для проведения продающих вебинаров и курсов.</div>
      <div className="third_screen_list">
        <div className="third_screen_list_arrow">
          <div className="third_screen_list_option_main">
            <div>EDLY</div>
            <div>это</div>
          </div>
        </div>
        <div className="third_screen_list_option">
          <div className="third_screen_list_option_logo"><img src={icon_1} alt="" /></div>
          <div className="third_screen_list_option_label">
            <div className="third_screen_list_option_text"><b>Неограниченное количество участников на ваших вебинарах</b></div>
          </div>
        </div>
        <div className="third_screen_list_option">
          <div className="third_screen_list_option_logo"><img src={icon_2} alt="" /></div>
          <div className="third_screen_list_option_label">
            <div className="third_screen_list_option_text"><b>Автоматическое сохранение записи</b></div>
            <div className="third_screen_list_option_text">на вашем канале YouTube в приватном доступе</div>
          </div>

        </div>
        <div className="third_screen_list_option">
          <div className="third_screen_list_option_logo"><img src={icon_3} alt="" /></div>
          <div className="third_screen_list_option_label">
            <div className="third_screen_list_option_text"><b>Техподдержка 7 дней в неделю</b></div>
            <div className="third_screen_list_option_text">и подробные инструкции в форме текста и видео</div>
          </div>

        </div>
        <div className="third_screen_list_option">
          <div className="third_screen_list_option_logo"><img src={icon_4} alt="" /></div>
          <div className="third_screen_list_option_label">
            <div className="third_screen_list_option_text"><b>Богатый маркетинговый функционал:</b></div>
            <div className="third_screen_list_option_text">подписные страницы, рассылка, продающие баннеры</div>
          </div>

        </div>
        <div className="third_screen_list_option">
          <div className="third_screen_list_option_logo"><img src={icon_5} alt="" /></div>
          <div className="third_screen_list_option_label">
            <div className="third_screen_list_option_text"><b>От 5 мест для ведущих, организаторов и модераторов</b></div>
            <div className="third_screen_list_option_text">Дружной команде любое дело по силам</div>
          </div>

        </div>
        <div className="third_screen_list_option">
          <div className="third_screen_list_option_logo"><img src={icon_6} alt="" /></div>
          <div className="third_screen_list_option_label">
            <div className="third_screen_list_option_text"><b>От 30 вебинарных комнат, с паролем или без</b></div>
            <div className="third_screen_list_option_text">легко работать на разные аудитории</div>
          </div>

        </div>
        <div className="third_screen_list_option">
          <div className="third_screen_list_option_logo"><img src={icon_7} alt="" /></div>
          <div className="third_screen_list_option_label">
            <div className="third_screen_list_option_text"><b>АвтоМодерация чата</b></div>
          </div>

        </div>
        <div className="third_screen_list_option">
          <div className="third_screen_list_option_logo"><img src={icon_8} alt="" /></div>
          <div className="third_screen_list_option_label">
            <div className="third_screen_list_option_text"><b>Плата за фактическое использование услуг</b></div>
            <div className="third_screen_list_option_text">Деньги не расходуются впустую</div>
          </div>

        </div>
      </div>
    </div>
  )
}
export default ThirdScreen
