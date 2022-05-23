import { combineReducers } from 'redux'
import rooms from './rooms/reducer'
import banner from './banner/reducer'
import conversions from './conversions/reducer'
import slides from './slides/reducer'
import webinars from './webinars/reducer'
import scenario from './scenario/reducer'
import products from './products/reducer'
import bannerBackgrounds from './bannerBackgrounds/reducer'

const appReducer = combineReducers({
  rooms,
  banner,
  conversions,
  slides,
  webinars,
  scenario,
  products,
  bannerBackgrounds
})

export default appReducer
