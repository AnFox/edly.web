import api from '../../../services/ApiService'
import * as types from './actionTypes'

function webinarsGetSuccess (payload, meta) {
  return {
    type: types.APP_WEBINARS_GET,
    payload,
    meta
  }
}

export function getWebinarsVisited (pageNumber = 1, pageSize = 8, status) {
  return dispatch => api.getVisitedWebinars(pageNumber, pageSize, status).then(res => dispatch(webinarsGetSuccess(res.data.data, res.data.meta)))
}
