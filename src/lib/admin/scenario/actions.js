import api from '../../../services/ApiService'
import * as types from './actionTypes'
import history from '../../../services/HistoryService'

function scenarioGetSuccess (payload, roomId) {
  return {
    type: types.APP_SCENARIO_GET,
    payload: {
      commands: payload,
      roomId: roomId
    }
  }
}

function scenarioDeleteCommand (commandId, roomId) {
  return {
    type: types.APP_SCENARIO_DELETE_COMMAND,
    payload: {
      commandId: commandId,
      roomId: roomId
    }
  }
}

function scenarioUpdateCommand (payload, roomId) {
  return {
    type: types.APP_SCENARIO_UPDATE_COMMAND,
    payload: {
      command: payload,
      roomId: roomId
    }
  }
}

function scenarioCreateCommand (payload, roomId) {
  return {
    type: types.APP_SCENARIO_CREATE_COMMAND,
    payload: {
      command: payload,
      roomId: roomId
    }
  }
}

export function scenarioClear (roomId) {
  return {
    type: types.APP_SCENARIO_CLEAR,
    payload: roomId
  }
}

export function roomSetScenario (roomId, scenario) {
  return dispatch => api.roomSetScenario(roomId, scenario)
    .then(res => dispatch(scenarioGetSuccess(res.data.data, roomId)))
}

export function getScenario (roomId) {
  return dispatch => api.roomGetScenario(roomId)
    .then(res => dispatch(scenarioGetSuccess(res.data.data, roomId)))
    .catch(() => {
      history.push('/login')
    })
}

export function deleteCommand (roomId, commandId) {
  return dispatch => api.roomScenarioDeleteCommand(roomId, commandId).then(() => {
    dispatch(scenarioDeleteCommand(commandId, roomId))
  })
}

export function updateCommand (roomId, commandId, data) {
  return dispatch => api.roomScenarioUpdateCommand(roomId, commandId, data).then((res) => {
    dispatch(scenarioUpdateCommand(res.data.data, roomId))
  })
}

export function createCommand (roomId, data) {
  return dispatch => api.roomScenarioCreateCommand(roomId, data).then((res) => {
    dispatch(scenarioCreateCommand(res.data.data, roomId))
  })
}

export function deleteAllCommands (roomId) {
  return dispatch => api.roomScenarioDeleteAllCommands(roomId).then(() => {
    dispatch(scenarioClear(roomId))
  })
}
