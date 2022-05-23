import api from '../../../services/ApiService'
import * as types from './actionTypes'
import { chatClear } from '../chat/actions'
import { alertbarShow } from '../alertbar/actions'

// function webinarSetPath (payload) {
//   return {
//     type: types.APP_WEBINAR_SET_PATH,
//     payload
//   }
// }
//
// function webinarSetSlug (payload) {
//   return {
//     type: types.APP_WEBINAR_SET_SLUG,
//     payload
//   }
// }

export function webinarGetSuccess (payload) {
  return {
    type: types.APP_WEBINAR_GET,
    payload
  }
}

export function webinarPublicGetSuccess (payload) {
  return {
    type: types.APP_WEBINAR_PUBLIC_INFO_GET,
    payload
  }
}
export function webinarPublicClear (payload) {
  return {
    type: types.APP_WEBINAR_PUBLIC_INFO_CLEAR,
    payload
  }
}


export function webinarSetSlide (payload) {
  return {
    type: types.APP_WEBINAR_SET_SLIDE,
    payload
  }
}

export function webinarSetLayout (payload) {
  return {
    type: types.APP_WEBINAR_SET_LAYOUT,
    payload
  }
}

export function webinarLeft (payload) {
  return {
    type: types.APP_WEBINAR_LEFT,
    payload
  }
}

export function webinarUpdateBanner (payload) {
  return {
    type: types.APP_WEBINAR_UPDATE_BANNER,
    payload
  }
}

export function webinarSetAmountOnline (payload) {
  return {
    type: types.APP_WEBINAR_AMOUNT_ONLINE_SET,
    payload
  }
}

export function webinarChangeTabInChatSuccess (payload) {
  return {
    type: types.APP_WEBINAR_CHANGE_TAB_IN_CHAT,
    payload
  }
}

export function getWebinarSlide (webinarId, slideId) {
  return api.webinarGetSlide(webinarId, slideId)
}

export function webinarChangeTabChat (webinarId, tab) {
  return dispatch => api.webinarChangeTabChat(webinarId, tab).then(() => {
    dispatch(alertbarShow({
      type: 'info',
      duration: 3000,
      messages: [`Вкладки переключены на "Товары"`]
    }))
  })
}

// отсутствует данный функционал
// export function setWebinarSlug (webinarSlug) {
//   return dispatch => dispatch(webinarSetSlug(webinarSlug))
// }
//
// export function setWebinarPath (webinarPath) {
//   return dispatch => dispatch(webinarSetPath(webinarPath))
// }

export function getWebinarVisitor (webinarId) {
  return dispatch => api.getVisitorWebinar(webinarId).then(res => dispatch(webinarGetSuccess(res.data.data)))
}

export function getIsWebinarVisited (webinarId) {
  return api.getIsWebinarVisited(webinarId)
}

export function leaveWebinar (webinarId) {
  return dispatch => {
    dispatch(chatClear())
    dispatch(webinarLeft(webinarId))
  }
  // return dispatch => api.leaveWebinar(webinarId);
}
