import React, { Component } from 'react'
import api from '../../services/ApiService'
import webinarIsStarted from '../../utils/webinarIsStarted'
import Products from '../../components/Products/Products'
import UserHeader from '../../components/UserHeader/UserHeader'
import AdminHeader from '../../components/AdminHeaderWebinar/AdminHeader'
import PropTypes from 'prop-types'
import './Webinar.scss'
import '../../components/CommonStyles/CommonStylesWebinar.scss'
import Chat from '../../components/Chat/Chat'
import AwaitWindow from '../../components/WebinarAwaitWindow'
import PopUpHelp from '../../components/WebinarPopUpHelp'
import { RequiredEmailVerification } from '../../components/UI'
import webSocket from '../../services/WebSocketService'
import history from '../../services/HistoryService'
import { getChatMessagesPromise } from '../../lib/app/chat/actions'
import { getIsWebinarVisited } from '../../lib/app/webinar/actions'
import BackgroundImage from '../../assets/img/Image_16.jpeg'
import MenuSlides from '../../components/MenuSlides'
import PlyrPlayer from '../../components/PlyrPlayer'



class Webinar extends Component {
  constructor () {
    super(undefined)
    this.state = {
      roomId: undefined,
      chatId: undefined,
      webinarId: undefined,
      startsAt: undefined,
      openStream: false,
      isVisited: false
    }
  }

  componentDidMount () {
    const { match: { params: { roomId, webinarSlug } } } = this.props
    this.setState({ roomId })
    const url = `/webinar/${roomId}${webinarSlug ? '/' + webinarSlug : ''}`
    if(this.props.location.state?.webinarId) {
      this.setState({ webinarId: this.props.location.state?.webinarId })
      this.webinarInit(this.props.location.state.webinarId, roomId)
    } else {
      api.getWebinarPublicInfo({ intendedUrl: url }).then(res => {
        this.props.webinarPublicGetSuccess(res.data.data)
        this.setState({ webinarId: res.data.data.id })
        getIsWebinarVisited(res.data.data.id).then((visited) => {
          this.setState({ isVisited: res.data })
          if (visited.data) {
            this.webinarInit(res.data.data.id, roomId)
          } else {
            history.push(`/webinar/${roomId}/signup`)
          }
        })
      })
    }

  }

  static getDerivedStateFromProps (props, state) {
    if (state.startsAt !== props.webinar.starts_at) {
      return { startsAt: props.webinar.starts_at }
    } else {
      return null
    }
  }

  componentWillUnmount () {
    webSocket.destroy()
  }

  webinarInit = (webinarId, roomId) => {
    this.props.getUser()
      .then(() => {
        if (this.props.user?.id) {
          webSocket.init()
          webSocket.wsSubscribePrivateChannel(this.props.user?.id, webinarId)
        }
      })
    this.props.getWebinar(webinarId)
      .then(() => {
        if (this.props.webinar[webinarId].moderatable || this.props.webinar[webinarId].adminable) {
          this.props.getWebinarOwner(webinarId)
        }
        if (this.props.webinar[webinarId].enter_allowed === false && !(this.props.webinar[webinarId].moderatable || this.props.webinar[webinarId].adminable)) {
          this.props.showPopUp('AccessDeniedEntryInWebinar')

          history.push('/')
          return false
        }
        if (this.props.webinar[webinarId].starts_at) {
          this.setState({ startsAt: this.props.webinar[webinarId].starts_at })
        }

        if (this.props.webinar[webinarId].is_started) {
          this.setState({ openStream: true })
        }

        if (this.props.webinar[webinarId].chat_id) {
          const chatId = this.props.webinar[webinarId].chat_id
          // eslint-disable-next-line no-constant-condition
          const initialAmountOnline = this.props.webinar[webinarId].type_id === 2 ? this.props.webinar[webinarId].amountOnline : 0
          this.setState({ chatId }, () => {
            webSocket.init()
            webSocket.wsSubscribeChatChannel(chatId, this.props.webinar[webinarId].id, initialAmountOnline)
            webSocket.wsSubscribeRoomChannel(roomId)
            webSocket.wsSubscribeWebinarChannel(webinarId)
          })
          getChatMessagesPromise(chatId, 1, 100).then(res => this.props.getChatMessages(this.props.webinar[webinarId].id, chatId, res.data.meta.last_page, res.data.meta.per_page))
        }
      })
  }

  openHelp = (open) => {
    const help = document.getElementById('chat_help')
    if (open) {
      help.style.display = 'block'
    } else {
      help.style.display = 'none'
    }
  }



  setStream = (boolean) => {
    if (this.state.openStream !== boolean) {
      this.setState({ openStream: boolean })
    }
  }

  render () {
    const { user, webinar, authLogout } = this.props

    const currentWebinar = webinar[this.state.webinarId] || {}
    const isShowSlider = () => currentWebinar.presentation && (currentWebinar.presentation.layout !== null && currentWebinar.presentation.layout !== 'video-only')

    if (user?.owner && user?.phone && !user?.phone_verified_at) {
      // this.props.history.push('/verifyphone');
    }

    if (user?.id && !user?.verified) {
      return <RequiredEmailVerification/>
    }

    if (!currentWebinar.id) {
      return <></>
    }

    const config = {
      autoplay: true,
      youtube: {
        noCookie: false,
        rel: 0,
        controls: 0,
        disablekb: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        autoplay: 1
      },
      fullscreen: { enabled: true, fallback: true, iosNative: false, container: null },
      ratio: '16:9',
      controls: [],
    }

    const getPositionVideo = () => {
      const position = currentWebinar.presentation?.layout
      switch (position) {
      case 'video-only':
        return 'video-only'
      case 'top-left':
        return 'top-left'
      case 'top-right':
        return 'top-right'
      case 'bottom-right':
        return 'bottom-right'
      default:
        return 'video-only'
      }
    }

    const getBackgroundImage = () => {
      if (currentWebinar.layout && currentWebinar.layout === 'video-only') {
        return BackgroundImage
      } else {
        if (currentWebinar.adminable || currentWebinar.moderatable) {
          if (this.props.slide) {
            return this.props.slide.url
          } else {
            return currentWebinar.presentation && currentWebinar.presentation.slide && currentWebinar.presentation.slide.url || BackgroundImage
          }
        }
        return currentWebinar.presentation && currentWebinar.presentation.slide && currentWebinar.presentation.slide.url || BackgroundImage
      }
    }

    return (
      <>
        {currentWebinar.adminable ? (
          <AdminHeader openHelp={this.openHelp} user={user} authLogout={authLogout} webinarId={this.state.webinarId}/>
        ) : (
          <UserHeader openHelp={this.openHelp} user={user} authLogout={authLogout} webinar={currentWebinar}/>
        )}
        <div className="room_main">
          <div className="room_main_grid_left">
            {currentWebinar.adminable && isShowSlider() ? <MenuSlides webinarId={this.state.webinarId} /> : null}
            <div className="player-container" style={{ backgroundImage: `url(${getBackgroundImage()})` }}>
              {webinarIsStarted(currentWebinar) ? (
                <>
                  <PlyrPlayer
                    config={config}
                    className={getPositionVideo()}
                    dateStartVideo={new Date(currentWebinar.starts_at)}
                    forward={(new Date() - new Date(currentWebinar.starts_at)) / 1000}
                    hideControl={true}
                    videoId={currentWebinar.video_id}
                    overlay={true}
                  />
                </>
              ) : (
                <AwaitWindow
                  setStream={this.setStream}
                  webinarId={this.state.webinarId}
                />
              )}
            </div>
            <div className="chat_banners">
              <Products webinarId={this.state.webinarId}/>
            </div>
          </div>
          <div>
            <Chat
              webinar={currentWebinar}
              moderator={currentWebinar.moderatable}
              openHelp={this.openHelp}
              block={!currentWebinar.chat_enabled}
              banners={currentWebinar.banners}
              submitMessage={this.submitMessage}
              usersOnline={currentWebinar.amountOnline}
            />
          </div>
        </div>
        <PopUpHelp openHelp={this.openHelp} />
      </>
    )
  }
}

Webinar.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      roomId: PropTypes.string,
      webinarSlug: PropTypes.string
    }).isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    state: PropTypes.shape({
      roomId: PropTypes.number,
      webinarId: PropTypes.number
    })
  }).isRequired,
  authLogout: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  getBanners: PropTypes.func.isRequired,
  getWebinar: PropTypes.func.isRequired,
  leaveWebinar: PropTypes.func.isRequired,
  getChatMessages: PropTypes.func.isRequired,
  postChatMessages: PropTypes.func.isRequired,
  updateChatMessages: PropTypes.func.isRequired,
  getWebinarOwner: PropTypes.func.isRequired,
  alertbarHide: PropTypes.func.isRequired,
  webinarPublicGetSuccess: PropTypes.func.isRequired,
  showPopUp: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    verified: PropTypes.bool.isRequired,
    admin: PropTypes.bool.isRequired,
    status: PropTypes.number.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    email_verified_at: PropTypes.string,
    phone: PropTypes.string,
    phone_verified_at: PropTypes.string,
    owner: PropTypes.bool
  }).isRequired,
  webinar: PropTypes.shape({
    id: PropTypes.number.isRequired,
    room_id: PropTypes.number.isRequired,
    access_allowed: PropTypes.bool.isRequired,
    enter_allowed: PropTypes.bool,
    chat_enabled: PropTypes.bool.isRequired,
    is_published: PropTypes.bool.isRequired,
    author_user_id: PropTypes.number.isRequired,
    adminable: PropTypes.bool.isRequired,
    type_id: PropTypes.number.isRequired,
    moderatable: PropTypes.bool.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    layout: PropTypes.string,
    is_started: PropTypes.bool,
    waiting_text: PropTypes.string,
    video_id: PropTypes.string,
    video_src: PropTypes.string,
    is_bot_assign_required: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
    bot_url_telegram: PropTypes.string,
    bot_url_whatsapp: PropTypes.string,
    bot_url_viber: PropTypes.string,
    starts_at: PropTypes.string.isRequired,
    finished_at: PropTypes.string,
    duration_minutes: PropTypes.number.isRequired,
    chat_id: PropTypes.number.isRequired,
    amountOnline: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    presentation: PropTypes.shape({
      layout: PropTypes.string.isRequired,
      slide: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      }).isRequired
    }),
    banners: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      room_id: PropTypes.number.isRequired,
      is_visible: PropTypes.bool.isRequired,
      product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        currency: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          code: PropTypes.string.isRequired,
          sign: PropTypes.string.isRequired
        }).isRequired,
        price: PropTypes.number.isRequired
      }),
      image: PropTypes.string.isRequired,
      url: PropTypes.string,
      title: PropTypes.string.isRequired
    })),
  }).isRequired,
  slide: PropTypes.shape({
    url: PropTypes.string.isRequired
  }),
  authToken: PropTypes.string.isRequired,
}

export default Webinar
