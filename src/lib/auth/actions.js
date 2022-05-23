import { extractFormErrors } from '../../utils'

import api from '../../services/ApiService'
import history from '../../services/HistoryService'

import * as types from './actionTypes'
import { webinarPublicGetSuccess } from '../app/webinar/actions'
import { getUser, userGetSuccess } from '../app/user/actions'

export function updateTokens (tokens) {
  return {
    type: types.LOG_IN,
    payload: tokens
  }
}

export function deleteTokens () {
  return {
    type: types.LOG_OUT
  }
}

export function authLogin (credentials, callback = null) {
  return dispatch => api.authLogin(credentials).then(() => {
    dispatch(getUser()).then(() => {
      if (callback) {
        callback()
      }
    })
  }).catch(e => extractFormErrors(e))
}

export function authRegister (credentials, callback = null) {
  return dispatch => api.authRegister(credentials).then(() => {
    dispatch(getUser()).then(() => {
      if (callback) {
        callback()
      }
    })
  }).catch(e => extractFormErrors(e))
}

export function authFinishRegister (credentials, callback = null) {
  return (dispatch) => api.authFinishRegister(credentials).then((res) => {
    dispatch(userGetSuccess(res.data.data))
    callback && callback()
  }).catch(e => extractFormErrors(e))
}

export function authLogout () {
  return () => api.authLogout()
}

export function authForgot (data, callback = null) {
  return () => api.authForgot(data).then(() => {
    callback && callback()
  })
}

function authEmailCheckSuccess (payload) {
  return {
    type: types.AUTH_EMAIL_CHECK,
    payload
  }
}

export function authEmailCheck (data) {
  return (dispatch) => {
    dispatch(authEmailCheckSuccess(false))

    return api.authEmailCheck(data).then((res) => {
      dispatch(authEmailCheckSuccess(res.data.data.allow))

      if (!res.data.data.allow) {
        return { email: 'ERRORS.EMAIL_ALREADY_REGISTERED' }
      }

      return {}
    })
  }
}

export function authEmailConfirm (data, redirectUrl) {
  return () => api.authEmailConfirm(data).then(() => {
    history.push(redirectUrl)
  })
}

export function getWebinarInfoFromIntendedUrl (roomId, intendedUrl) {
  const data = { intendedUrl: intendedUrl }

  return dispatch => api.getWebinarPublicInfo(data).then(res => {
    dispatch(webinarPublicGetSuccess({
      roomId,
      webinar: res.data.data
    }))
  })
}

export function authenticationNetwork (credentials) {
  return dispatch => api.authNetwork(credentials).then((res) => {
    api.updateToken(res.data.data)
    dispatch(getUser())
  }).catch((e) => {
    history.push('/login')

    return e
  })
}

export function authNetworkConnect (data) {
  return dispatch => api.authNetworkConnect(data).then(() => {
    dispatch(getUser())
    history.push('/')
  }).catch((e) => {
    history.push('/')
    return e
  })
}

export function authNetworkDisconnect (data) {
  return () => api.authNetworkDisconnect(data).then(() => {
    // console.log(res);
  })
}
