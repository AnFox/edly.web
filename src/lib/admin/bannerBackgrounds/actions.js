import api from '../../../services/ApiService'
import * as types from './actionTypes'

function backgroundsGetSuccess (payload) {
  return {
    type: types.APP_ADMIN_BACKGROUNDS_GET,
    payload
  }
}

function backgroundGetSuccess (payload) {
  return {
    type: types.APP_ADMIN_BACKGROUND_GET,
    payload
  }
}

export function getBackgrounds (roomId) {
  return dispatch => api.backgroundsGet(roomId).then(res => dispatch(backgroundsGetSuccess(res.data.data)))
}

export function addBackground (roomId, image) {
  return dispatch => api.postBackground(roomId, image).then(res => dispatch(backgroundGetSuccess(res.data.data)))
}

