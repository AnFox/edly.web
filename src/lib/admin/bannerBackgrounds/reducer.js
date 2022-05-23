import * as types from './actionTypes'

const defaultBackgrounds = [
  '/assets/img_fon_small/fon_small_1.jpg',
  '/assets/img_fon_small/fon_small_2.jpg',
  '/assets/img_fon_small/fon_small_3.jpg',
  '/assets/img_fon_small/fon_small_4.jpg',
  '/assets/img_fon_small/fon_small_5.jpg',
  '/assets/img_fon_small/fon_small_6.jpg',
  '/assets/img_fon_small/fon_small_7.jpg',
  '/assets/img_fon_small/fon_small_8.jpg',
  '/assets/img_fon_small/fon_small_9.jpg',
  '/assets/img_fon_small/fon_small_10.jpg',
  '/assets/img_fon_small/fon_small_11.jpg',
  '/assets/img_fon_small/fon_small_12.jpg',
  '/assets/img_fon_small/fon_small_13.jpg',
  '/assets/img_fon_small/fon_small_14.jpg',
  '/assets/img_fon_small/fon_small_15.jpg',
  '/assets/img_fon_small/fon_small_16.jpg',
  '/assets/img_fon_small/fon_small_17.jpg',
  '/assets/img_fon_small/fon_small_18.jpg'
]

const initialState = {
  customBg: [],
  defaultBg: defaultBackgrounds
}

const bannerBackgrounds = (state = initialState, { type, payload }) => {
  switch (type) {
  case types.APP_ADMIN_BACKGROUNDS_GET:
    return {
      ...state,
      customBg: [ ...payload]
    }

  case types.APP_ADMIN_BACKGROUND_GET:
    return {
      ...state,
      customBg: [payload, ...state.customBg]
    }

  default:
    return state
  }
}

export default bannerBackgrounds
