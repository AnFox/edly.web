import api from '../../../services/ApiService'
import * as types from './actionTypes'
import { alertbarShow } from '../../app/alertbar/actions'
import { webinarGetSuccess } from '../../app/webinar/actions'
import { getUser } from '../../app/user/actions'
import { addConversationPdf } from '../conversions/actions'

export function roomGetSuccess (payload) {
  return {
    type: types.APP_ADMIN_ROOM_GET,
    payload
  }
}
function roomAdminGetSuccess (payload, meta) {
  return {
    type: types.APP_ADMIN_ROOMS_GET,
    payload,
    meta
  }
}

function roomPostSuccess (payload) {
  return {
    type: types.APP_ADMIN_ROOM_POST,
    payload
  }
}

function roomUpdateSuccess (payload) {
  return {
    type: types.APP_ADMIN_ROOM_UPDATE,
    payload
  }
}

export function roomUpdateWebinar (payload) {
  return {
    type: types.APP_ADMIN_ROOM_WEBINAR_UPDATE,
    payload
  }
}

export function roomUpdateBanner (payload) {
  return {
    type: types.APP_ADMIN_ROOM_UPDATE_BANNER,
    payload
  }
}

export function roomDeleteBanner (payload) {
  return {
    type: types.APP_ADMIN_ROOM_DELETE_BANNER,
    payload
  }
}

export function roomPostBanner (payload) {
  return {
    type: types.APP_ADMIN_ROOM_POST_BANNER,
    payload
  }
}

function roomDeleteSuccess (payload) {
  return {
    type: types.APP_ADMIN_ROOM_DELETE,
    payload
  }
}

function roomClear (payload) {
  return {
    type: types.APP_ADMIN_ROOM_CLEAR,
    payload
  }
}

export function getAdminRooms (pageNumber = 1, pageSize = 8) {
  return dispatch => api.getOwnRooms(pageNumber, pageSize).then(res => dispatch(roomAdminGetSuccess(res.data.data, res.data.meta)))
}

export function getAdminRoom (roomId) {
  return dispatch => api.getRoomById(roomId).then(res => dispatch(roomGetSuccess({
    roomId,
    room: res.data.data
  })))
}

export function postRoom (data) {
  return dispatch => api.postRoom(data)
    .then(res => dispatch(roomPostSuccess({
      roomId: res.data.data.id,
      room: res.data.data
    })))
    .catch(() => {
      dispatch(getUser())
    })
}

export function updateRoom (roomId, data) {
  return dispatch => api.updateRoom(roomId, data).then(res => dispatch(roomUpdateSuccess({
    roomId,
    room: res.data.data
  })))
}

export function roomSetCover (roomId, media) {
  return dispatch => api.roomSetCover(roomId, media)
    .then(res => {
      dispatch(webinarGetSuccess(res.data.data))
    })
}

export function roomUnsetCover (roomId) {
  return dispatch => api.roomUnsetCover(roomId)
    .then(res => dispatch(webinarGetSuccess(res.data.data)))
}

export function webinarSetVideoPosition (webinarId, layout) {
  return api.webinarSetVideoPosition(webinarId, layout)
}

export function roomSetPresentation (room, pdf, quality) {
  return dispatch => api.roomSetPresentation(room.id, pdf, quality)
    .then(res => {
      dispatch(addConversationPdf({ roomId: room.id, conversionId: res.data.data.id }))
      dispatch(roomUpdateSuccess({ roomId: room.id, room: { ...room, presentation: { name: pdf.name, slides_total: '-' } } }))
    })
}

export function roomUnsetPresentation (roomId) {
  return dispatch => api.roomUnsetPresentation(roomId)
    .then(res => dispatch(roomUpdateSuccess( { roomId, room: res.data.data })))
}

export function roomSetPresentationStatus (roomId, conversionId) {
  return api.roomSetPresentationStatus(roomId, conversionId)
}

export function duplicateRoom (roomId, data) {
  return dispatch => api.duplicateRoom(roomId, data).then(res => {
    const room = res.data.data
    dispatch(roomPostSuccess({ roomId: room.id, room }))
    dispatch(alertbarShow({
      type: 'info',
      messages: [`Комната ${roomId} была успешно скопирована под номером ${room.id}.`]
    }))
  })
}

export function delRoom (roomId) {
  return dispatch => api.deleteRoom(roomId).then(() => {
    dispatch(roomDeleteSuccess(roomId))
    dispatch(alertbarShow({
      type: 'info',
      messages: [`Комната ${roomId} была успешно удалена.`]
    }))
  })
}

export function startWebinar (webinarId, data) {
  return dispatch => api.startWebinar(webinarId, data).then(res => {
    const webinar = res.data.data
    dispatch(webinarGetSuccess(webinar))
    dispatch(alertbarShow({
      type: 'info',
      messages: ['Вебинар начат.']
    }))
  })
}

export function finishWebinar (webinarId) {
  return dispatch => api.finishWebinar(webinarId).then(res => {
    dispatch(webinarGetSuccess(res.data.data))
    dispatch(alertbarShow({
      type: 'info',
      messages: ['Вебинар завершен.']
    }))
  })
}

export function postGenerateSlug () {
  return async () => {
    const res = await api.postGenerateWebinarSlug()
    return res.data
  }
}

export function unblockWebinarUser (webinarId, userId) {
  return dispatch => api.unblockWebinarUser(webinarId, userId).then(res => {
    const webinar = res.data.data
    dispatch(roomGetSuccess(webinar))
  })
}

export function unblockAllWebinarUsers (webinarId) {
  return dispatch => api.unblockAllWebinarUsers(webinarId).then(res => {
    const webinar = res.data.data
    dispatch(roomGetSuccess(webinar))
  })
}

export function unblockAllWebinarUsersInList (webinarId, idList) {
  return dispatch => api.unblockAllWebinarUsersInList(webinarId, idList)
    .then(res => {
      const webinar = res.data.data
      dispatch(roomGetSuccess(webinar))
    })
}

export function clearRoom (roomId) {
  return roomClear(roomId)
}


export function exportRoomVisitorsEmailToCSV (roomId) {
  return api.exportRoomVisitorsEmailToCSV(roomId)
}

export function exportRoomVisitorsPhoneToCSV (roomId) {
  return api.exportRoomVisitorsPhoneToCSV(roomId)
}

export function exportRoomVisitorsEmailAndPhoneToCSV (roomId) {
  return api.exportRoomVisitorsPhoneAndEmailToCSV(roomId)
}
