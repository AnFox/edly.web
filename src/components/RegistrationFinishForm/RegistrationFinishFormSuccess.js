import React from 'react'
import Mail from '../../assets/svg/Mail_Icon.svg'
import { useHistory } from 'react-router-dom'
import './RegistrationFinishForm.scss'
import '../CommonStyles/CommonStylesForm.scss'

const RegistrationFinishFormSuccess = () => {
  const history = useHistory()
  const handleSubmit = (e) => {
    e.preventDefault()
    history.push('/login')
  }

  return (
    <form className="registration_form_success_options">
      <div className="title_auth title_success_options">Регистрация</div>
      <img src={Mail} alt="mail"className="image_success_options" />
      <div className="label label_one_success_option"><strong>Ссылка для завершения регистрации отправлена!</strong></div>
      <div className="label label_two_success_option">Проверьте электронную почту.<br />Если письма нет, поищите в папке со спамом.</div>
      <button type="submit"
        className="btn-primary button_success_options"
        onClick={handleSubmit}
      >
        На главную страницу
      </button>
    </form>
  )
}
export default RegistrationFinishFormSuccess
