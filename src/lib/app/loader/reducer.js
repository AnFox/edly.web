import * as types from './actionTypes'

const initialState = {
  counter: 0
}

const loader = (state = initialState, { type }) => {
  switch (type) {
  case types.APP_LOADER_SHOW:
    return {
      ...state,
      counter: 1,
    }

  case types.APP_LOADER_HIDE:
    return {
      ...state,
      counter: 0, //state.counter - 1,
    }

  default:
    return state
  }
}

export default loader
