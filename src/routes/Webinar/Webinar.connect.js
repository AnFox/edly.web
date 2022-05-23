import { connect } from 'react-redux'
import Webinar from './Webinar'
import {
  deleteChatMessagesSuccess,
  getChatMessages,
  postChatMessages,
  updateChatMessages,
  getChatMessagesPromise
} from '../../lib/app/chat/actions'
import {
  getWebinarVisitor,
  leaveWebinar,
  webinarPublicGetSuccess
} from '../../lib/app/webinar/actions'
import { getUser, userGetSuccess } from '../../lib/app/user/actions'
import { getWebinarOwner } from '../../lib/admin/webinars/actions'
import { authLogout } from '../../lib/auth/actions'
import { getBanners } from '../../lib/admin/banner/actions'
import { alertbarHide } from '../../lib/app/alertbar/actions'
import { showPopUp } from '../../lib/app/popUp/actions'

function mapStateToProps (state) {
  return {
    isLogged: Boolean(state.auth.tokens),
    authToken: state.auth.tokens?.access_token,
    user: state.app.user,
    webinar: state.app.webinar,
    banners: state.admin.banner.banners,
    slide: state.admin.slides?.pagination?.currentSlide
  }
}

export default connect(mapStateToProps, {
  getUser,
  getBanners,
  getWebinar: getWebinarVisitor,
  getWebinarOwner,
  leaveWebinar,
  getChatMessages,
  postChatMessages,
  updateChatMessages,
  userGetSuccess,
  deleteChatMessagesSuccess,
  authLogout,
  alertbarHide,
  webinarPublicGetSuccess,
  getChatMessagesPromise,
  showPopUp
})(Webinar)
