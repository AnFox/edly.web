import { OAUTH_CALLBACK, OAUTH_FB_ID } from '../config'

class SocialAuthService {
  parseResponse(string) {
    return string.slice(1).split('&').reduce((mem, pair) => {
      const [key, value] = pair.split('=')

      return {
        ...mem,
        [key]: value,
      }
    }, {})
  }

  loginFacebook(isLogin = true) {
    const redirect = this.getCallbackUrl('facebook', isLogin ? 'login' : 'bind')
    const url = `https://www.facebook.com/v7.0/dialog/oauth?client_id=${OAUTH_FB_ID}&response_type=token&redirect_uri=${redirect}&scope=email`

    this.redirectTo(url)
  }

  getCallbackUrl(network, type) {
    return `${OAUTH_CALLBACK}${network}/${type}`
  }

  redirectTo(url) {
    debugger
    window.location = url
  }
}

const socialAuth = new SocialAuthService()

export default socialAuth
