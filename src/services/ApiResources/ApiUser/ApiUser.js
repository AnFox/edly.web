const ApiUser = {
  getUser () {
    return this.api.get('/user')
  },

  updateUser (data) {
    return this.api.post('/user', data)
  }
}

export default ApiUser
