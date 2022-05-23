import * as types from './actionTypes'

const initialState = {}

const scenario = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_SCENARIO_GET:
    return {
      ...state,
      [payload.roomId]: payload.commands
    }
  case types.APP_SCENARIO_CLEAR: {
    const scenario = state
    delete scenario[payload]
    return {
      ...scenario,
    }
  }
  case types.APP_SCENARIO_DELETE_COMMAND:

    return {
      ...state,
      [payload.roomId]: state[payload.roomId].filter(command => command.id !== payload.commandId)
    }
  case types.APP_SCENARIO_UPDATE_COMMAND:
    return {
      ...state,
      [payload.roomId]: state[payload.roomId].map(command => command.id === payload.command.id ? payload.command : command).sort((a, b) => a.timeshift - b.timeshift)
    }
  case types.APP_SCENARIO_CREATE_COMMAND:
    return {
      ...state,
      [payload.roomId]: [...state[payload.roomId], payload.command].sort((a, b) => a.timeshift - b.timeshift)
    }
  default:
    return state
  }
}

export default scenario
