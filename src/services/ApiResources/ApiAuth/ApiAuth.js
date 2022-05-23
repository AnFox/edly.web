const ApiAuth = {
  authNetwork (data) {
    return this.api.post('/auth/network/', data)
  },

  authNetworkConnect (data) {
    return this.api.post('/profile/me/network/connect', data)
  },

  authNetworkDisconnect (data) {
    return this.api.post('/profile/me/network/disconnect', data)
  },

  authLogin (credentials) {
    return this.api.login(credentials)
  },

  authRegister ({ email, password, first_name, last_name, phone, successTermsOfUse, successOnlyAcc, intendedUrl }) {
    return this.api.register({
      email,
      password,
      password_confirmation: password,
      first_name,
      last_name,
      phone,
      successTermsOfUse,
      successOnlyAcc,
      intendedUrl
    })
  },

  authFinishRegister ({ first_name, intendedUrl }) {
    const data = {
      first_name,
      intendedUrl
    }

    return this.api.post('/user', data)
  },

  authLogout () {
    return this.api.logout()
  },

  authForgot (data) {
    return this.api.post('/auth/password/forgot', data)
  },

  authEmailCheck (data) {
    return this.api.post('/auth/email/check', data)
  },

  authEmailConfirm (data) {
    return this.api.post('/auth/email/confirm', data)
  }
}

export default ApiAuth
