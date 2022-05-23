import React from 'react'
import Human from '../../assets/svg/landing-fourth-screen-human.svg'
import './FourthScreen.scss'

const FourthScreen = () => {

  return(
    <div className="fourth_screen">
      <div className="fourth_screen_circle" />
      <div className="icon-4" />
      <div className="section_title_fourth">Оплата и тарифы</div>
      <div className="fourth_screen_logo_main">
        <img src={Human} alt="" className="fourth_screen_logo_human" />
        <div className="fourth_screen_logo_background">
          <div className="fourth_screen_logo_background_title">
                        Мы берем оплату только за фактическое использование EDLY.
          </div>
          <div className="fourth_screen_logo_background_label">
                        Единый тариф на все.
          </div>
        </div>
      </div>
      <div className="fourth_screen_payments">
        <div className="fourth_screen_payments_option">
          <div className="fourth_screen_payments_option_title">
                        Вебинары и автовебинары
          </div>
          <div className="fourth_screen_payments_option_cost">
                        3 руб. за место
          </div>
          <div className="fourth_screen_payments_option_label">
            <b>
                        использованное участниками на вашем вебинаре или автовебинаре.
            </b>
          </div>
          <div className="fourth_screen_payments_option_label">
                        Включает все функции и опции без ограничений (кроме отдельно подключаемой услуги страниц регистрации и рассылки)
          </div>
        </div>
        <div className="fourth_screen_payments_option">
          <div className="fourth_screen_payments_option_title">
                        Касса
          </div>
          <div className="fourth_screen_payments_option_cost">
                        0% от оборота
          </div>
          <div className="fourth_screen_payments_option_label">
            <b>
                        Мы можем подключить ваш аккаунт платежной системы, и тогда вы ничего не платите нам с оплат ваших клиентов!
            </b>
          </div>

        </div>
      </div>
    </div>
  )
}
export default FourthScreen
