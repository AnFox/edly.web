const ApiBanners = {
  bannersGet (roomId) {
    return this.api.get(`/admin/room/${roomId}/banner`)
  },

  postBanner (data) {
    return this.api.post('/admin/banner', data)
  },

  updateBanner (bannerId, data) {
    return this.api.put(`/admin/banner/${bannerId}`, data)
  },

  deleteBanner (bannerId) {
    return this.api.delete(`/admin/banner/${bannerId}`)
  },

  toggleBannerVisibility (bannerId, data) {
    return this.api.put(`/admin/banner/${bannerId}/toggle`, data)
  }
}

export default ApiBanners
