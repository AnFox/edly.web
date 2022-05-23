import * as types from './actionTypes'

const initialState = {
  rooms: [],
  currentRoom: {}
}

const rooms = (state = initialState, { type, payload, meta }) => {
  switch (type) {
  case types.APP_ADMIN_ROOM_GET:
    return {
      ...state,
      currentRoom: { ...state.currentRoom, [payload.roomId]: payload.room }
    }
  case types.APP_ADMIN_ROOM_UPDATE:
    return {
      currentRoom: { ...state.currentRoom, [payload.roomId]: payload.room },
      rooms: state.rooms.map(room => room.id === payload.room.id ? payload.room : room)
    }
  case types.APP_ADMIN_ROOM_WEBINAR_UPDATE:
    return {
      ...state,
      rooms: state.rooms.map(room => room.id === payload.roomId ? { ...room, webinars: [payload.webinar, ...room.webinars] } : room)
    }
  case types.APP_ADMIN_ROOMS_GET:
    return {
      ...state,
      rooms: payload,
      pagination: meta
    }

  case types.APP_ADMIN_ROOM_POST:
    return {
      ...state,
      rooms: [payload.room, ...state.rooms]
    }

  case types.APP_ADMIN_ROOM_DELETE:
    return {
      ...state,
      rooms: state.rooms.filter((room) => room.id !== payload)
    }

  case types.APP_ADMIN_ROOM_CLEAR:
    return {
      ...state,
      currentRoom: { ...state.currentRoom, [payload]: {} }
    }

  case types.APP_ADMIN_ROOM_UPDATE_BANNER:
    return {
      ...state,
      currentRoom: {
        ...state.currentRoom,
        [payload.roomId]: {
          ...state.currentRoom[payload.roomId],
          banners: state.currentRoom[payload.roomId].banners.map(banner => banner.id === payload.banner.id ? payload.banner : banner)
        }
      }
    }

  case types.APP_ADMIN_ROOM_DELETE_BANNER:
    return {
      ...state,
      currentRoom: {
        ...state.currentRoom,
        [payload.roomId]: {
          ...state.currentRoom[payload.roomId],
          banners: state.currentRoom[payload.roomId].banners.filter(banner => banner.id !== payload.banner.id)
        }
      }
    }

  case types.APP_ADMIN_ROOM_POST_BANNER:
    return {
      ...state,
      currentRoom: {
        ...state.currentRoom,
        [payload.roomId]: {
          ...state.currentRoom[payload.roomId],
          banners: [ ...state.currentRoom[payload.roomId].banners, payload.banner]
        }
      }
    }

  default:
    return state
  }
}

export default rooms
