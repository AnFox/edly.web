import React from 'react'
import Button from '../UI/Button'
import Facebook from '../../assets/svg/Facebook.svg'
import Google from '../../assets/svg/Google.svg'
import VK from '../../assets/svg/VK.svg'
import PropTypes from 'prop-types'
import socialAuth from '../../services/SocialAuthService'
import { GoogleLogin } from 'react-google-login'
import { OAUTH_GOOGLE_ID } from '../../config'
import api from '../../services/ApiService'
import VkAuth from 'react-vk-auth'
import { useHistory } from 'react-router-dom'

const RegistrationFormLinkingSocialNetworks = (props) => {
  const history = useHistory()

  const responseGoogleSuccess = (response) => {
    const token = response.wc.access_token
    if (token) {
      socialAuth.redirectTo(`${socialAuth.getCallbackUrl('google', 'login')}#access_token=${token}`)
    }
  }

  const responseGoogleFailure = (response) => {
    console.log('responseGoogleFailure', response)
  }

  const handleVkResponse = async (data) => {
    api.authNetwork(data).then(res =>
      api.updateToken(res.data.data)
    )
  }

  return (
    <div className="registration_form_options">
      <div className="title_auth title_margin">Регистрация</div>
      <div className="registration_form_subtitle_linking">Привяжите соц. сеть, чтобы не вспоминать пароль при авторизации</div>
      <div className="registration_form_social_networks_list">
        <img src={Facebook} alt="Facebook" onClick={() => socialAuth.loginFacebook(true)} />
        <GoogleLogin
          clientId={OAUTH_GOOGLE_ID}
          buttonText="Login"
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          isSignedIn={false}
          scope="email profile openid"
          render={renderProps => (
            <img
              src={Google}
              alt="Google"
              onClick={renderProps.onClick}
            />
          )}
        />
        <div id="login_vk_box" style={{ display: 'none' }}>
          <VkAuth id="login_vk" apiId="7621573" callback={handleVkResponse} />
        </div>
        <img src={VK} alt="VK" onClick={() => document.getElementById('login_vk').click()} />
      </div>
      <Button size="big" onClick={() => history.push('/')}>Пропустить</Button>
    </div>
  )
}

RegistrationFormLinkingSocialNetworks.propTypes = {

}

export default RegistrationFormLinkingSocialNetworks
