const ApiRooms = {
  getRoomById (roomId) {
    return this.api.get(`/admin/room/${roomId}`)
  },

  postGenerateWebinarSlug () {
    return this.api.post('/admin/room/slug')
  },

  getOwnRooms (pageNumber = 1, pageSize = 8) {
    return this.api.get(`/admin/room?page[number]=${pageNumber}&page[size]=${pageSize}`, { silentRequest: false })
  },

  postRoom (data) {
    return this.api.post('/admin/room', data)
  },

  duplicateRoom (webinarId, data) {
    return this.api.post(`/admin/room/${webinarId}/duplicate`, data)
  },

  deleteRoom (roomId) {
    return this.api.delete(`/admin/room/${roomId}`)
  },

  updateRoom (roomId, data) {
    return this.api.put(`/admin/room/${roomId}`, data)
  },

  roomSetPresentation (roomId, pdf, quality) {
    const formData = new FormData()
    formData.append('pdf', pdf, pdf.name)
    formData.append('quality', quality)
    return this.api.post(`/admin/room/${roomId}/pdf`, formData)
  },

  roomUnsetPresentation (roomId) {
    return this.api.delete(`/admin/room/${roomId}/pdf`)
  },

  roomSetPresentationStatus (roomId, conversionId) {
    return this.api.get(`/admin/room/${roomId}/pdf/conversion/${conversionId}`, { silentRequest: true })
  },

  roomSetCover (roomId, media) {
    const formData = new FormData()
    formData.append('cover', media, media.name)

    return this.api.post(`/admin/room/${roomId}/cover`, formData)
  },

  roomUnsetCover (roomId) {
    return this.api.delete(`/admin/room/${roomId}/cover`)
  },

  roomGetCollectionSlides (roomId, page, pageSize) {
    return this.api.get(`/admin/room/${roomId}/slides?page[number]=${page}&page[size]=${pageSize}`)
  },

  exportRoomVisitorsEmailToCSV (roomId) {
    return this.api.get(`/admin/room/${roomId}/visitors/export/email/csv`)
  },

  exportRoomVisitorsPhoneToCSV (roomId) {
    return this.api.get(`/admin/room/${roomId}/visitors/export/phone/csv`)
  },

  exportRoomVisitorsPhoneAndEmailToCSV (roomId) {
    return this.api.get(`/admin/room/${roomId}/visitors/export/email_phone/csv`)
  },

  roomSetScenario (roomId, script) {
    const formData = new FormData()
    formData.append('script', script, script.name)

    return this.api.post(`/admin/room/${roomId}/script/import`, formData)
  },

  roomGetScenario (roomId) {
    return this.api.get(`/admin/room/${roomId}/command`)
  },

  roomScenarioDeleteCommand (roomId, commandId) {
    return this.api.delete(`/admin/room/${roomId}/command/${commandId}`)
  },

  roomScenarioUpdateCommand (roomId, commandId, data) {
    return this.api.put(`/admin/room/${roomId}/command/${commandId}`, data)
  },

  roomScenarioCreateCommand (roomId, data) {
    return this.api.post(`/admin/room/${roomId}/command`, data)
  },

  roomScenarioDeleteAllCommands (roomId) {
    return this.api.delete(`/admin/room/${roomId}/command`)
  }

}

export default ApiRooms
