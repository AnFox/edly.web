import * as types from './actionTypes'

export function addConversationPdf (payload) {
  return {
    type: types.APP_CONVERSIONS_PDF_ADD,
    payload
  }
}

export function deleteConversationPdf (payload) {
  return {
    type: types.APP_CONVERSIONS_PDF_DELETE,
    payload
  }
}
