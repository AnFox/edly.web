class UserServiceApiResources {
  requestCode() {
    return this.api.post(`/token/phone/request`)
  }

  submitCode(data) {
    return this.api.post(`/token/phone/confirm`, data)
  }

  requestEmail() {
    return this.api.post(`/token/email/request`)
  }
}

export default UserServiceApiResources
