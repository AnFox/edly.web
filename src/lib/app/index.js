import { combineReducers } from 'redux'
import loader from './loader/reducer'
import locale from './locale/reducer'
import chat from './chat/reducer'
import alertbar from './alertbar/reducer'
import webinars from './webinars/reducer'
import webinar from './webinar/reducer'
import user from './user/reducer'
import orders from './orders/reducer'
import intendedUrl from '../navigation/reducer'
import product from './product/reducer'
import popUp from './popUp/reducer'

const appReducer = combineReducers({
  loader,
  locale,
  alertbar,
  user,
  webinars,
  webinar,
  chat,
  orders,
  navigation: intendedUrl,
  product,
  popUp
})

export default appReducer
