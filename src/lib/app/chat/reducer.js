import * as types from './actionTypes'
import { LOG_OUT } from '../../auth/actionTypes'

const initialState = {}

const chat = (state = initialState, { type, payload, meta }) => {
  switch (type) {
  case types.APP_CHAT_CLEAR:
  case LOG_OUT:
    return {
      ...initialState
    }
  case types.APP_CHAT_MESSAGES_GET:
    return {
      ...state,
      [payload.webinarId]: { messages: [...payload.messages, ...(state[payload.webinarId] && state[payload.webinarId].messages) ? state[payload.webinarId].messages : []], pagination: meta }
    }
  case types.APP_CHAT_MESSAGE_GET:
    return {
      ...state,
      [payload.webinarId]: { ...state[payload.webinarId], messages: [...(state[payload.webinarId] && state[payload.webinarId].messages) ? state[payload.webinarId].messages : [], payload.message] }
    }
  case types.APP_CHAT_MESSAGES_WS:
    return appChatMessagesWS(state, payload)
  case types.APP_CHAT_MESSAGE_UPDATE:
    return {
      ...state,
      [payload.webinarId]: { ...state[payload.webinarId], messages: state[payload.webinarId].messages.map(message => message.id === payload.payload.id ? payload.payload : message) }
    }
  case types.APP_CHAT_MESSAGE_DELETE:
    return {
      ...state,
      [payload.webinarId]: { ...state[payload.webinarId], messages: state[payload.webinarId].messages.filter((message) => !payload.idList.includes(message.id)) }
    }
  default:
    return state
  }
}

const appChatMessagesWS = (state, payload) => {
  const messages = [ ...state[payload.webinarId].messages ]
  if (messages.find(message => message.id === payload.message.id)) {
    // уже есть это сообщение
    return {
      ...state,
      [payload.webinarId]: { ...state[payload.webinarId], messages: messages }
    }
  } else {
    return {
      ...state,
      [payload.webinarId]: { ...state[payload.webinarId], messages: [ ...messages, payload.message ] }
    }
  }
}

export default chat
