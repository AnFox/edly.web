import React, { Component } from 'react'
import Success from '../../assets/svg/Success.svg'
import history from '../../services/HistoryService'
import './RegistrationSuccess.scss'
import '../CommonStyles/CommonStylesForm.scss'


export default class ResetFormSucks extends Component {
    handleSubmit = (e) => {
      e.preventDefault()
      history.push('/login')
    };

    render() {
      return (
        <form className="reg_success_form">
          <div className="title_auth reg_success_title">Регистрация</div>
          <img className="image_icon_margin reg_success_icon" src={Success} alt="success"/>
          <div className="label reg_success_label_one"><strong>Ваша учетная запись активирована!</strong></div>
          <div className="label reg_success_label_two">На вашу эл. почту был выслан пароль</div>
          <button type="submit"
            className="btn-primary"
            onClick={this.handleSubmit}
          >
          Войти в систему
          </button>
        </form>
      )
    }

};
