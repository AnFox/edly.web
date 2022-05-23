import React, { Component } from 'react'
import Mail from '../../assets/svg/Mail_Icon.svg'
import history from '../../services/HistoryService'
import './ResetPasswordForm.scss'
import '../CommonStyles/CommonStylesForm.scss'


export default class ResetFormSucks extends Component {

  handleSubmit (e) {
    e.preventDefault()
    history.push('/login')
  };

    state = {
      email: ''
    };


    updateInput = (event) => {
      this.setState({ email: event.target.value })
    };

    render () {
      return (
        <form className="res_pass_from">
          <div className="title_auth res_pass_margin">Сброс пароля</div>
          <img className="res_pass_icon" src={Mail} alt="mail"/>
          <div className="label res_pass_lavel_one" >Ссылка для сброса пароля отправлена!</div>
          <div className="label res_pass_lavel_two" >Проверьте электронную почту.<br />Если письма нет, поищите в папке со спамом.</div>
          <button type="submit"
            className="btn-primary"
            onClick={this.handleSubmit}
            style={{ paddingLeft: '2em', paddingRight: '2em' }}
          >
          На главную страницу
          </button>
        </form>
      )
    }

};
