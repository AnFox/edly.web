import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { animateScroll as scroll } from "react-scroll"
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { Link } from 'react-router-dom'
import './ResetPasswordForm.scss'
import '../CommonStyles/CommonStylesForm.scss'


export default class AuthForm extends Component {
  static propTypes = {
    authForgot: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
  };

  handleSubmit = (e) => {
    e.preventDefault()
    this.testEmail()
  };

  state = {
    email: '',
    error: '',
  };

  testEmail = () => {
    let input = document.getElementsByClassName('input_text')
    let label = document.getElementsByClassName('label_bottom_info')
    let err = document.getElementsByClassName('error_message')
    let access = true
    if(!this.state.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/i)){
      input[0].classList.add('input_error')
      label[0].style.display = 'none'
      err[0].style.display = 'block'
      this.setState({ error: 'Введите правильный почтовый адрес' })
      access = false
    } else {
      input[0].classList.remove('input_error')
      label[0].style.display = 'block'
      err[0].style.display = 'none'
      this.setState({ error: '' })
    }
    if(access){
      const { email } = this.state
      this.props.authForgot({ email }, this.props.sendMessage)
    }
  }

  updateInput = (event) => {
    this.setState({ email: event.target.value })
  };

  render() {
    return (
      <form className="res_pass_from">
        <div className="title_auth res_pass_margin">Сброс пароля</div>
        <input
          type="text"
          className="input_text"
          placeholder="Эл. почта"
          required
          onChange={this.updateInput}
        />
        <div style={{ display: 'none' }} className="error_message error_option">{this.state.error}</div>
        <div className="label_bottom_info res_pass_info_options">Ссылка для сброса пароля будет отправлена ​​на вашу эл. почту</div>
        <div>
        </div>
        <button type="submit"
          className="btn-primary"
          onClick={this.handleSubmit}
          disabled={this.state.email === ''}>
          Отправить
        </button>
        <div className="authform_line res_pass_line" />
        <div className="label res_pass_label">Я вспомнил(а) пароль <Link className="href" to="/login">Войти</Link></div>
        <div className="btn_up btn_up_mobile" onClick={() => scroll.scrollToTop()}>
          <ExpandLessIcon />
        </div>
      </form>
    )
  }

};
