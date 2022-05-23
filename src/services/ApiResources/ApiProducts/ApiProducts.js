const ApiProducts = {
  getProducts (pageNumber = 1, pageSize = 8) {
    return this.api.get(`/admin/product?page[number]=${pageNumber}&page[size]=${pageSize}`, { silentRequest: false })
  },

  getProduct (productId) {
    return this.api.get(`/admin/product/${productId}`)
  },

  postProduct (data) {
    return this.api.post('/admin/product', data)
  },

  updateProduct (productId, data) {
    return this.api.put(`/admin/product/${productId}`, data)
  },

  deleteProduct (productId) {
    return this.api.delete(`/admin/product/${productId}`)
  },

  duplicateProduct (productId, data) {
    return this.api.post(`/admin/product/${productId}/duplicate`, data)
  },

}

export default ApiProducts
