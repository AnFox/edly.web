import * as types from './actionTypes'
import { LOG_OUT } from '../../auth/actionTypes'
import { WebinarTypeTabsInChat } from '../../../dict/webinar'

const initialState = {
  webinarPublic: {}
}

const webinar = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_WEBINAR_LEFT:
    return {
      ...state,
      [payload]: null,
      webinarPublic: state.webinarPublic
    }
  case LOG_OUT:
    return {
      ...initialState
    }
  case types.APP_WEBINAR_SET_SLUG:
    return {
      ...state,
      [payload.id]: { ...state[payload.id], intendedUrl: payload.intendedUrl }
    }

  case types.APP_WEBINAR_SET_PATH:
    return {
      ...state,
      [payload.id]: { ...state[payload.id], intendedUrl: payload.path }
    }

  case types.APP_WEBINAR_GET:
    return {
      ...state,
      [payload.id]: {
        ...state[payload.id],
        ...payload,
        tabInChat: state[payload.id]?.tabInChat || WebinarTypeTabsInChat.CHAT
      }
    }

  case types.APP_WEBINAR_PUBLIC_INFO_GET:
    return {
      ...state,
      webinarPublic: { ...state.webinarPublic, [payload.roomId]: payload.webinar }
    }
  case types.APP_WEBINAR_PUBLIC_INFO_CLEAR:
    return {
      ...state,
      webinarPublic: { ...state.webinarPublic, [payload.roomId]: undefined }
    }

  case types.APP_WEBINAR_SET_SLIDE:
    return {
      ...state,
      [payload.id]: {
        ...(state[payload.id] || {}),
        presentation: { ...state[payload.id].presentation,
          slide: {
            ...state[payload.id].presentation.slide,
            id: payload.slide.id,
            name: payload.slide.name,
            url: payload.slide.url
          }
        }
      }
    }

  case types.APP_WEBINAR_SET_LAYOUT:
    return {
      ...state,
      [payload.id]: {
        ...(state[payload.id] || {}),
        presentation: { ...state[payload.id].presentation,
          layout: payload.layout
        }
      }
    }

  case types.APP_WEBINAR_UPDATE_BANNER:
    return {
      ...state,
      [payload.id]: {
        ...(state[payload.id] || {}),
        banners: state.banners.map(item => item.id === payload.banner.id ? payload.banner : item)
      }
    }

  case types.APP_WEBINAR_AMOUNT_ONLINE_SET:
    return {
      ...state,
      [payload.id]: {
        ...(state[payload.id] || {}),
        amountOnline: payload.amountOnline
      }
    }

  case types.APP_WEBINAR_CHANGE_TAB_IN_CHAT:
    return {
      ...state,
      [payload.id]: {
        ...(state[payload.id] || {}),
        tabInChat: payload.tab
      }
    }
  default:
    return state
  }
}

export default webinar
