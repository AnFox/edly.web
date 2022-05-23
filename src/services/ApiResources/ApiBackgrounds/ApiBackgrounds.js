const ApiBackgrounds = {
  backgroundsGet (roomId) {
    return this.api.get(`/admin/room/${roomId}/banner/image`)
  },

  postBackground (roomId, image) {
    const formData = new FormData()
    formData.append('image', image, image.name)
    return this.api.post(`/admin/room/${roomId}/banner/image`, formData, { silentRequest: false })
  }
}

export default ApiBackgrounds
