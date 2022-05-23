const ApiWebinars = {
  createWebinar (roomId, data) {
    return this.api.post(`/admin/room/${roomId}/webinar`, data)
  },

  updateWebinar (webinarId, data) {
    return this.api.put(`/admin/webinar/${webinarId}`, data)
  },

  getWebinarPublicInfo (data) {
    return this.api.post('/public/webinar', data)
  },

  getOwnerWebinar (webinarId) {
    return this.api.get(`/admin/webinar/${webinarId}`, { silentRequest: false })
  },

  getVisitorWebinar (webinarId) {
    return this.api.get(`/webinar/${webinarId}`, { silentRequest: false })
  },

  getIsWebinarVisited (webinarId) {
    return this.api.get(`/webinar/${webinarId}/is_visited`)
  },

  leaveWebinar (webinarId) {
    return this.api.post(`/webinar/${webinarId}/leave`)
  },

  exportWebinarVisitorsEmailToCSV (webinarId) {
    return this.api.get(`/admin/webinar/${webinarId}/visitors/export/email/csv`)
  },

  exportWebinarVisitorsPhoneToCSV (webinarId) {
    return this.api.get(`/admin/webinar/${webinarId}/visitors/export/phone/csv`)
  },

  exportWebinarVisitorsPhoneAndEmailToCSV (webinarId) {
    return this.api.get(`/admin/webinar/${webinarId}/visitors/export/email_phone/csv`)
  },

  getVisitedWebinars (pageNumber = 1, pageSize = 8, status = 'current') {
    return this.api.get(`/webinar?filter[type]=${status}&page[number]=${pageNumber}&page[size]=${pageSize}`)
  },

  getOwnerWebinars (roomId, filter = 'current', page = 1, pageSize = 8) {
    return this.api.get(`/admin/room/${roomId}/webinar?filter[type]=${filter}&page[number]=${page}&page[size]=${pageSize}`)
  },

  startWebinar (webinarId, data = null) {
    return this.api.post(`/admin/webinar/${webinarId}/start`, data)
  },

  finishWebinar (webinarId) {
    return this.api.post(`/admin/webinar/${webinarId}/finish`)
  },

  webinarGetSlide (webinarId, slideId) {
    return this.api.get(`/admin/webinar/${webinarId}/slides/${slideId}`)
  },

  webinarChangeTabChat (webinarId, tab) {
    return this.api.put(`/admin/webinar/${webinarId}/tab`, { tab: tab })
  },

  webinarSetVideoPosition (webinarId, layout) {
    return this.api.put(`/admin/webinar/${webinarId}/layout`, { layout: layout })
  },

  unblockAllWebinarUsers (webinarId) {
    return this.api.delete(`/admin/block/webinar/${webinarId}/user`)
  },

  unblockAllWebinarUsersInList (webinarId, idList) {
    return this.api.delete(`/admin/block/webinar/${webinarId}/users`, idList)
  }
}

export default ApiWebinars
