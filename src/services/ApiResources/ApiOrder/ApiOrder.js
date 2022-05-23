const ApiOrder = {
  createWebinarProductOrder (productId, webinarId) {
    const data = {
      product_id: productId,
      webinar_id: webinarId
    }

    return this.api.post('/rooms/order', data)
  },

  createProductOrder (productId) {
    const data = {
      product_id: productId
    }

    return this.api.post('/public/product/order', data)
  }
}

export default ApiOrder
