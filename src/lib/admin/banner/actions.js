import api from '../../../services/ApiService'
import * as types from './actionTypes'
import { webinarUpdateBanner } from '../../app/webinar/actions'
import { roomDeleteBanner, roomPostBanner } from '../rooms/actions'

function bannersGetSuccess (payload) {
  return {
    type: types.APP_BANNER_GET,
    payload
  }
}

function bannerPostSuccess (payload) {
  return {
    type: types.APP_BANNER_POST,
    payload
  }
}

function bannerUpdateSuccess (payload) {
  return {
    type: types.APP_BANNER_UPDATE,
    payload
  }
}

function bannerDeleteSuccess (payload) {
  return {
    type: types.APP_BANNER_DELETE,
    payload
  }
}

export function getBanners (roomId) {
  return dispatch => api.bannersGet(roomId).then(res => dispatch(bannersGetSuccess(res.data.data)))
}

export function postBanner (roomId, data) {
  return dispatch => api.postBanner(data).then(res => {
    dispatch(roomPostBanner({ roomId, banner: res.data.data }))
    dispatch(bannerPostSuccess(res.data.data))
  })
}

export function updateBanner (bannerId, data) {
  return dispatch => api.updateBanner(bannerId, data).then(res => dispatch(bannerUpdateSuccess(res.data.data))
  )
}

export function deleteBanner (roomId, bannerId) {
  return dispatch => api.deleteBanner(bannerId).then(() => {
    dispatch(bannerDeleteSuccess(bannerId))
    return dispatch(roomDeleteBanner({ roomId, banner: { id: bannerId } }))
  })
}

export function toggleBannerVisibility (webinarId, bannerId, data) {
  return dispatch => api.toggleBannerVisibility(bannerId, data).then(res =>
    dispatch(webinarUpdateBanner({ id: webinarId, banner: res.data.data }))
  )
}
