import React, { Component } from 'react'
import Success from '../../assets/svg/Success.svg'
import history from '../../services/HistoryService'
import './ResetPasswordForm.scss'
import '../CommonStyles/CommonStylesForm.scss'

export default class ResetFormSucks extends Component {
  handleSubmit (e) {
    e.preventDefault()
    history.push('/login')
  };

  render () {
    return (
      <form className="reset_pass_after_mail_form">
        <div className="title_auth reset_pass_after_mail_margin">Сброс пароля</div>
        <img className="reset_pass_after_mail_icon" src={Success} alt="mail"/>
        <div className="label reset_pass_after_label">Вы успешно обновили <br />ваш пароль!</div>
        <button type="submit"
          className="btn-primary"
          onClick={this.handleSubmit}

        >
          Войти
        </button>
      </form>
    )
  }
};
