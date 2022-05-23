import api from '../../../services/ApiService'
import * as types from './actionTypes'

function chatMessagesGetSuccess (payload, meta) {
  return {
    type: types.APP_CHAT_MESSAGES_GET,
    payload,
    meta
  }
}

export function chatMessageGetSuccess (payload) {
  return {
    type: types.APP_CHAT_MESSAGE_GET,
    payload
  }
}

function chatMessagesPostSuccess (payload) {
  return {
    type: types.APP_CHAT_MESSAGES_POST,
    payload
  }
}

export function updateChatMessages (payload) {
  return {
    type: types.APP_CHAT_MESSAGES_WS,
    payload
  }
}

export function updateMessage (payload) {
  return {
    type: types.APP_CHAT_MESSAGE_UPDATE,
    payload
  }
}

export function getChatMessages (webinarId, chatId, pageNumber = 1, pageSize = 100) {
  return dispatch => api.getChatMessages(chatId, pageNumber, pageSize).then(res => dispatch(chatMessagesGetSuccess({
    webinarId: webinarId,
    messages: res.data.data
  }, res.data.meta)))
}

export function getChatMessagesPromise (chatId, pageNumber = 1, pageSize = 100) {
  return api.getChatMessages(chatId, pageNumber, pageSize)
}

export function postChatMessages (webinarId, chatId, data) {
  return dispatch => api.postChatMessages(chatId, data).then((res) => {
    dispatch(chatMessagesPostSuccess())
    dispatch(chatMessageGetSuccess({ webinarId, message: res.data.data }))
  })
}

export function deleteChatMessagesSuccess (payload) {
  return {
    type: types.APP_CHAT_MESSAGE_DELETE,
    payload
  }
}

export function chatClear () {
  return {
    type: types.APP_CHAT_CLEAR
  }
}

export function deleteChatMessages (webinarId, chatId, idList) {
  return dispatch => api.deleteChatMessages(chatId, idList).then(() => dispatch(deleteChatMessagesSuccess({ webinarId, idList })))
}

export function blockUserForChatMessages (chatId, idList) {
  return () => api.blockUserChatMessages(chatId, idList)
}

export function banUserOfChatMessages (chatId, idList) {
  return () => api.banUserChatMessages(chatId, idList)
}

export function banUserAndDeleteChatMessages (webinarId, chatId, idList) {
  return dispatch => api.banUserAndDeleteChatMessages(chatId, idList).then(() => dispatch(deleteChatMessagesSuccess({ webinarId, idList })))
}

export function blockChatForEveryone (chatId) {
  return () => api.blockChat(chatId)
}

export function unblockChatForEveryone (chatId) {
  return () => api.unblockChat(chatId)
}
