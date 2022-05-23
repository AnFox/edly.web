import React from 'react'
import './SecondScreen.scss'
import Mouse from '../../assets/svg/Mouse.svg'

const SecondScreen = () => {

  return(
    <div className="second_screen">
      <div className="second_screen_circle" />
      <div><img className="second_screen_mouse" src={Mouse} alt=""/></div>
      <div className="section_title">Особенности</div>
      <div className="second_screen_features_list">
        <div className="second_screen_features_list_option">
          <div className="second_screen_features_list_option_img" />
          <div className="second_screen_features_list_option_title">
            <h2>Вебинары на базе YouTube и не только</h2>
          </div>
          <div className="second_screen_features_list_option_label">
                        Оплата по факту за количество реальных зрителей.
          </div>
        </div>
        <div className="second_screen_features_list_option">
          <div className="second_screen_features_list_option_img" />
          <div className="second_screen_features_list_option_title">
            <h2>Автовебинары</h2>
          </div>

          <div className="second_screen_features_list_option_label">
                        Возможность реализовать уникальные сценарии по вашим требованиям.
          </div>
        </div>
        <div className="second_screen_features_list_option">
          <div className="second_screen_features_list_option_img" />
          <div className="second_screen_features_list_option_title">
            <h2>Аналитика и интеграция</h2>
          </div>
          <div className="second_screen_features_list_option_label">
                        EDLY можно интегрировать с любыми аналитическими сервисами через API, чтобы определять источники трафика и точно считать конверсию в клиента на каждом шагу.
          </div>
        </div>
        <div className="second_screen_features_list_option">
          <div className="second_screen_features_list_option_img" />
          <div className="second_screen_features_list_option_title">
            <h2>Курсовая платформа</h2>
          </div>
          <div className="second_screen_features_list_option_label">
                        EDLY позволяет связывать вебинары, курсы, тесты и приём платежей в одно целое как единое ядро.
          </div>
        </div>
      </div>
    </div>
  )
}
export default SecondScreen
