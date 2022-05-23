import * as types from './actionTypes'

export function setNavigationIntendedUrl(payload) {
  return {
    type: types.APP_NAVIGATION_SET_INTENDED_URL,
    payload
  }
}

export function navigationSetIntendedUrl(webinarPath) {
  return dispatch => dispatch(setNavigationIntendedUrl(webinarPath))
}
