import api from '../../../services/ApiService'
import * as types from './actionTypes'
import { roomUpdateWebinar } from '../rooms/actions'

function setWebinars (payload, meta) {
  return {
    type: types.APP_ADMIN_WEBINARS_GET,
    payload,
    meta
  }
}

function setWebinar (payload) {
  return {
    type: types.APP_ADMIN_WEBINAR_GET,
    payload
  }
}

function createWebinarSuccess (payload) {
  return {
    type: types.APP_ADMIN_WEBINARS_SUCCESS,
    payload
  }
}

export function getWebinars (roomId, filter, page, pageSize) {
  return dispatch => api.getOwnerWebinars(roomId, filter, page, pageSize)
    .then(res => {
      dispatch(setWebinars(res.data.data, res.data.meta))
    })
}

export function createWebinar (context, roomId, data) {
  return dispatch => api.createWebinar(roomId, data)
    .then(res => {
      if (context === 'ROOMS_LIST') {
        dispatch(roomUpdateWebinar({ roomId: roomId, webinar: res.data.data }))
      } else {
        dispatch(createWebinarSuccess(res.data.data))
      }
    })
}

export function getWebinarOwner (webinarId) {
  return dispatch => api.getOwnerWebinar(webinarId).then(res => dispatch(setWebinar(res.data.data)))
}

export function updateWebinar (webinarId, data) {
  return dispatch => api.updateWebinar(webinarId, data)
    .then(res => dispatch(dispatch(setWebinar(res.data.data)))
    )
}

export function exportWebinarVisitorsEmailToCSV (roomId) {
  return api.exportWebinarVisitorsEmailToCSV(roomId)
}

export function exportWebinarVisitorsPhoneToCSV (roomId) {
  return api.exportWebinarVisitorsPhoneToCSV(roomId)
}

export function exportWebinarVisitorsEmailAndPhoneToCSV (roomId) {
  return api.exportWebinarVisitorsPhoneAndEmailToCSV(roomId)
}
