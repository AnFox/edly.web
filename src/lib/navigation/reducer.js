import * as types from './actionTypes'
import { LOG_OUT } from '../auth/actionTypes'

const initialState = null

const intendedUrl = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_NAVIGATION_SET_INTENDED_URL:
    return payload
  case LOG_OUT:
    return initialState
  default:
    return state
  }
}

export default intendedUrl
