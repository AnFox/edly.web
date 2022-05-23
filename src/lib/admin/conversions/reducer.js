import * as types from './actionTypes'

const initialState = {
  pdf: []
}

const conversions = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_CONVERSIONS_PDF_ADD:
    return {
      ...state,
      pdf: [...state.pdf, payload]
    }

  case types.APP_CONVERSIONS_PDF_DELETE:
    return {
      ...state,
      pdf: state.pdf.filter((item) => item.roomId !== payload.roomId)
    }

  default:
    return state
  }
}

export default conversions
