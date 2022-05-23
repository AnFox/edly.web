import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ResetPasswordForm.scss'
import '../CommonStyles/CommonStylesForm.scss'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

export default class AuthForm extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.testData()
    // this.props.sendMessage();
    // this.props.authLogin({email: username, password, remember_me: true});
  };

  state = {
    isPasswordShowNew: false,
    isPasswordShowOld: false,
    oldPass: '',
    newPass: '',
    errorNewPass: '',
    errorOldPass: ''
  };

  updateInputOld = (event) => {
    this.setState({ oldPass: event.target.value })
  };

  updateInputNew = (event) => {
    this.setState({ newPass: event.target.value })
  };

  togglePasswordVisibilityNew = () => {
    this.setState({ isPasswordShowNew: !this.state.isPasswordShowNew })
  };

  togglePasswordVisibilityOld = () => {
    this.setState({ isPasswordShowOld: !this.state.isPasswordShowOld })
  };

  testData = () => {
    const input = document.getElementsByClassName('input_text')
    const icon = document.getElementsByClassName('input_eye_icon')
    const label = document.getElementsByClassName('label_bottom_info')
    const errorLabel = document.getElementsByClassName('error_message')
    let access = true
    if (this.state.newPass.length < 6) {
      label[0].style.display = 'none'
      input[0].classList.add('input_error')
      icon[0].classList.add('input_error')
      errorLabel[0].style.display = 'block'
      this.setState({ errorNewPass: 'Заполните поле (не менее 6 символов)' })
      access = false
    } else {
      label[0].style.display = 'block'
      input[0].classList.remove('input_error')
      icon[0].classList.remove('input_error')
      errorLabel[0].style.display = 'none'
      this.setState({ errorNewPass: '' })
      if (this.state.newPass !== this.state.oldPass) {
        input[1].classList.add('input_error')
        icon[1].classList.add('input_error')
        this.setState({ errorOldPass: 'Введенные пароли не совпадают' })
        access = false
      } else {
        input[1].classList.remove('input_error')
        icon[1].classList.remove('input_error')
        this.setState({ errorOldPass: '' })
      }
      if (access) {
        this.props.sendMessage()
      }
    }

  };

  render () {
    const { isPasswordShowNew, isPasswordShowOld } = this.state
    return (
      <form className="reset_pass_after_mail_form">
        <div className="title_auth reset_pass_after_mail_margin">Сброс пароля</div>
        <div className="input_icon">
          <input
            type={(isPasswordShowNew) ? 'text' : 'password'}
            className="input_text"
            placeholder="Новый пароль"
            onChange={this.updateInputNew}
          />
          <div className="input_eye_icon" onTouchStart={(e) => { e.preventDefault(); this.togglePasswordVisibilityNew() }} onTouchEnd={(e) => { e.preventDefault(); this.togglePasswordVisibilityNew() }} onMouseDown={this.togglePasswordVisibilityNew} onMouseUp={this.togglePasswordVisibilityNew}>
            {!this.state.isPasswordShowNew ? <Visibility style={{ width: '1em', height: '1em', backgroundColor: 'transparent', color: '#8F9BB3' }} /> : <VisibilityOff style={{ width: '1em', height: '1em', backgroundColor: 'transparent', color: '#8F9BB3' }} />}
          </div>
        </div>
        <div className="error_message error_margin" style={{ display: 'none' }}>{this.state.errorNewPass}</div>
        <div className="label_bottom_info reset_pass_after_mail_info__options">Должен содержать не менее 6 символов</div>
        <div className="input_icon">
          <input
            type={(isPasswordShowOld) ? 'text' : 'password'}
            className="input_text"
            placeholder=""
            onChange={this.updateInputOld}
          />
          <div className="input_eye_icon" onTouchStart={(e) => { e.preventDefault(); this.togglePasswordVisibilityOld() }} onTouchEnd={(e) => { e.preventDefault(); this.togglePasswordVisibilityOld() }} onMouseDown={this.togglePasswordVisibilityOld} onMouseUp={this.togglePasswordVisibilityOld}>
            {!this.state.isPasswordShowOld ? <Visibility style={{ width: '1em', height: '1em', backgroundColor: 'transparent', color: '#8F9BB3' }} /> : <VisibilityOff style={{ width: '1em', height: '1em', backgroundColor: 'transparent', color: '#8F9BB3' }} />}
          </div>
        </div>
        <div className="error_message error_margin reset_pass_after_mail_input_icon_margin" >{this.state.errorOldPass}</div>
        <button type="submit"

          className="btn-primary"
          onClick={this.handleSubmit}>
          Сохранить
        </button>
      </form>
    )
  }

};

AuthForm.propTypes = {
  sendMessage: PropTypes.func.isRequired
}
