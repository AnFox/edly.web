const ApiChat = {
  getChatMessages (chatId, pageNumber, pageSize) {
    return this.api.get(`/chat/${chatId}/message?page[number]=${pageNumber}&page[size]=${pageSize}`, { silentRequest: true })
  },

  deleteChatMessages (chatId, idList) {
    return this.api.post(`/admin/chat/${chatId}/message/delete`, { idList })
  },

  blockUserChatMessages (chatId, idList) {
    return this.api.post(`/admin/chat/${chatId}/message/user/block`, { idList })
  },

  banUserChatMessages (chatId, idList) {
    return this.api.post(`/admin/chat/${chatId}/message/user/ban`, { idList })
  },

  banUserAndDeleteChatMessages (chatId, idList) {
    return this.api.post(`/admin/chat/${chatId}/message/delete/user/ban`, { idList })
  },

  postChatMessages (chatId, data) {
    return this.api.post(`/chat/${chatId}/message`, data, { silentRequest: true })
  },

  blockChat (chatId) {
    return this.api.put(`/admin/chat/${chatId}/block`)
  },

  unblockChat (chatId) {
    return this.api.put(`/admin/chat/${chatId}/unblock`)
  }
}
// "idList": [
//   10919
// ]
export default ApiChat
