const ApiAccount = {
  deleteAccountCard () {
    return this.api.post('/admin/account/card/delete')
  },

  setAccountPaymentSettings (data) {
    return this.api.put('/admin/account/settings/payment', data)
  },

  setAccountPixelSettings (data) {
    return this.api.put('/admin/account/settings/pixel', data)
  },

  unsetAccountPixelSettings () {
    return this.api.delete('/admin/account/settings/pixel')
  },

  createAccountBalanceRefillOrder (amount) {
    return this.api.post('/admin/account/refill', { amount }, { silentRequest: false })
  },

  getAccountOrders (pageNumber = 1, pageSize = 8) {
    return this.api.get(`/admin/account/orders?page[number]=${pageNumber}&page[size]=${pageSize}`)
  },

  searchAccountOrders (search, startDate, endDate, pageNumber = 1, pageSize = 8) {
    let url = `/admin/account/orders/search?filter[search]=${search}&page[number]=${pageNumber}&page[size]=${pageSize}`

    if (startDate) {
      url += `&filter[startDate]=${startDate}`
    }

    if (endDate) {
      url += `&filter[endDate]=${endDate}`
    }

    return this.api.get(url)
  }
}

export default ApiAccount
