import api from '../../../services/ApiService'
import * as types from './actionTypes'

export function roomSetSlides (payload) {
  return {
    type: types.APP_WEBINAR_SET_SLIDES,
    payload
  }
}

export function roomClearSlides (payload) {
  return {
    type: types.APP_WEBINAR_CLEAR_SLIDES,
    payload
  }
}

export function roomSlidesSetPagination (payload) {
  return {
    type: types.APP_WEBINAR_SET_PAGINATION,
    payload
  }
}

export function roomGetSlides (roomId, page, pageSize) {
  return dispatch => api.roomGetCollectionSlides(roomId, page, pageSize)
    .then(res => {
      dispatch(roomSetSlides({
        slides: res.data.data,
        roomId: roomId
      }))
      //dispatch(roomSlidesSetPagination({ currentPage: page, pageSize: pageSize, lastPage: res.data.meta.last_page }))
    })
}
