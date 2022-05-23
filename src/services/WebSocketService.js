import reduxStore from '../services/StoreService'
import {
  WS_APP_CLUSTER,
  WS_APP_KEY,
  WS_AUTH_ENDPOINT,
  WS_ENCYPTED,
  WS_PORT,
  WS_SERVER
} from '../config'
import Echo from 'laravel-echo'
import {
  webinarChangeTabInChatSuccess,
  webinarGetSuccess,
  webinarSetAmountOnline,
  webinarSetLayout,
  webinarSetSlide
} from '../lib/app/webinar/actions'
import { getUser, userAccountGetSuccess, userGetSuccess } from '../lib/app/user/actions'
import { alertbarHide, alertbarShow } from '../lib/app/alertbar/actions'
import { deleteChatMessagesSuccess, updateChatMessages, updateMessage } from '../lib/app/chat/actions'
import { defaultRoute } from '../lib/navigation'
import history from './HistoryService'
import { getWebinarsVisited } from '../lib/app/webinars/actions'
import { roomGetSuccess } from '../lib/admin/rooms/actions'
import { showPopUp } from '../lib/app/popUp/actions'

const store = reduxStore.get()

class WebSocketService {
  server = undefined;

  init() {
    const state = store.getState()
    if (!this.server) {

      const options = {
        broadcaster: 'pusher',
        key: WS_APP_KEY,
        cluster: WS_APP_CLUSTER,
        wsHost: WS_SERVER,
        wsPort: WS_PORT,
        wssPort: WS_PORT,
        encrypted: WS_ENCYPTED,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: WS_AUTH_ENDPOINT,
        auth: {
          headers: {
            Authorization: `Bearer ${state.auth.tokens.access_token}`,
            Accept: 'application/json',
          },
        },
      }

      this.server = new Echo(options)
    }
  }

  get() {
    return this.server
  }

  destroy() {
    if (this.server) {
      this.server.disconnect()
      this.server = null
    }
  }

  wsSubscribePrivateChannel = (userId, webinarId = null) => {
    // ApiUser Private Channel
    this.server.private(`user.${userId}`)
      .notification((notification) => {
        const { id, ...data } = notification
        switch (notification.type) {
        case 'PaymentSucceed':
          // console.log('[ApiUser Private Channel][Notification] PaymentSucceed', notification);
          // console.log('[ApiUser Private Channel][Notification] PaymentSucceed data', data);
          store.dispatch(alertbarHide())

          let messages = [
            'Оплата завершена успешно.',
          ]

          if (store.getState().app.user.account.is_limited === true && data.user.account.is_limited === false) {
            messages.push('Ваш аккаунт теперь работает без ограничений.')
          }

          store.dispatch(alertbarShow({
            type: 'info',
            messages: messages
          }))

          store.dispatch(userGetSuccess(data.user))
          store.dispatch(getWebinarsVisited())

          /*history.push('/checkpayment', {
              payment: notification.payment,
            });*/
          break

        case 'PaymentFailed':
          // console.log('[ApiUser Private Channel][Notification] PaymentFailed', notification);
          store.dispatch(alertbarHide())
          store.dispatch(alertbarShow({
            type: 'warning',
            messages: [
              `Оплата не прошла по причине "${notification.payment.fail_message}".`,
            ]
          }))
          store.dispatch(getUser())
          store.dispatch(getWebinarsVisited())

          /*history.push('/checkpayment', {
              payment: notification.payment,
            });*/
          break

        case 'MustVerifyEmail':
          // console.log('[ApiUser Private Channel][Notification] MustVerifyEmail', notification);
          store.dispatch(alertbarHide())
          store.dispatch(alertbarShow({
            type: 'warning',
            messages: [`Ваш email не подтвержден.`]
          }))
          break

        case 'EmailVerified':
          // console.log('[ApiUser Private Channel][Notification] EmailVerified', notification);
          store.dispatch(userGetSuccess(data))
          store.dispatch(alertbarHide())
          store.dispatch(alertbarShow({
            type: 'info',
            messages: [`Ваш Email успешно подтвержден.`]
          }))
          window.location.reload()
          break

        case 'MustVerifyPhone':
          // console.log('[ApiUser Private Channel][Notification] MustVerifyPhone', notification);
          store.dispatch(alertbarHide())
          if (window.location && window.location.pathname && !window.location.pathname.includes('/register')) {
            history.push('/verifyphone')
          }
          break

        case 'PhoneVerified':
          // console.log('[ApiUser Private Channel][Notification] PhoneVerified', notification);
          store.dispatch(userGetSuccess(data))

          store.dispatch(alertbarHide())
          store.dispatch(alertbarShow({
            type: 'info',
            messages: [`Ваш телефон ${notification.phone} успешно подтвержден.`]
          }))

          if (webinarId) {
            window.location.reload()
          } else {
            history.push(defaultRoute)
          }

          break
        case 'AccountUpdated':
          store.dispatch(userAccountGetSuccess(data.account))
          break
        case 'WebinarChatBlocked':
          // console.log('[ApiUser Private Channel][Notification] WebinarChatBlocked', notification);
          store.dispatch(webinarGetSuccess(data))
          break

        case 'WebinarChatUnblocked':
          // console.log('[ApiUser Private Channel][Notification] WebinarChatUnblocked', notification);
          store.dispatch(webinarGetSuccess(data))
          break

        case 'WebinarAccessForbidden':
          // console.log('[ApiUser Private Channel][Notification] WebinarAccessForbidden', notification);
          store.dispatch(getWebinarsVisited())
          history.push(defaultRoute)
          break

        case 'WebinarAccessAllowed':
          // console.log('[ApiUser Private Channel][Notification] WebinarAccessAllowed', notification);
          store.dispatch(getWebinarsVisited())
          history.push(defaultRoute)
          break
        case 'UsersLimitReached':
          store.dispatch(showPopUp('OverloadedEntryInWebinar_TWO'))
          break
        case 'UsersLimitIsReaching':
          store.dispatch(showPopUp('OverloadedEntryInWebinar_ONE'))
          break

        default:
          // console.log('[ApiUser Private Channel][Notification] Not Handled Notification', notification);
          break
        }
      })
  };

  wsSubscribeChatChannel = (chatId, webinarId, initialAmountOnline = 0) => {

    function getAmountOnline() {
      return Object.keys(chatPresenceChannel.subscription.members.members).length
    }

    // Chat Presence Channel
    const chatPresenceChannel = this.server.join(`chat.${chatId}`)
      .here((members) => {
        // console.log('WebSocket ApiUser Joined Chat Presence Channel', members)
        let amountOnline = getAmountOnline()
        // console.log('members.length', members.length)
        // console.log('amountOnline', amountOnline)
        // console.log('initialAmountOnline', initialAmountOnline)
        store.dispatch(webinarSetAmountOnline({ id: webinarId, amountOnline: amountOnline + initialAmountOnline }))
      })
      .joining((payload) => {
        // console.log('WebSocket ApiUser Joining Chat Presence Channel', payload)
        // console.log('chatPresenceChannel.subscription.members', chatPresenceChannel.subscription.members)
        let amountOnline = getAmountOnline()
        // console.log('amountOnline', amountOnline)
        // console.log('initialAmountOnline', initialAmountOnline)
        store.dispatch(webinarSetAmountOnline({ id: webinarId, amountOnline: amountOnline + initialAmountOnline }))
      })
      .leaving((payload) => {
        // console.log('WebSocket ApiUser Leaving Chat Presence Channel', payload)
        // console.log('chatPresenceChannel.subscription.members', chatPresenceChannel.subscription.members)
        let amountOnline = getAmountOnline()
        // console.log('amountOnline', amountOnline)
        // console.log('initialAmountOnline', initialAmountOnline)
        store.dispatch(webinarSetAmountOnline({ id: webinarId, amountOnline: amountOnline + initialAmountOnline }))
      })
      .listen('.NewChatMessage', (payload) => {
        // console.log('[ApiUser Private Channel] NewChatMessage', payload);
        store.dispatch(updateChatMessages({
          webinarId,
          message: payload
        }))
      })
      .listen('.ChatMessageUpdated', (payload) => {
        // console.log('[ApiUser Private Channel] NewChatMessage', payload);
        store.dispatch(updateMessage({ webinarId, payload }))
      })
      .listen('.ChatMessageDeleted', (payload) => {
        // console.log('[ApiUser Private Channel] ChatMessageDeleted', e);
        store.dispatch(deleteChatMessagesSuccess({ webinarId, idList: payload }))
      })
      .listen('.WebinarChatBlockedForEveryone', (payload) => {
        // console.log('[ApiUser Private Channel] WebinarChatBlockedForEveryone', e);
        store.dispatch(webinarGetSuccess(payload))
      })
      .listen('.WebinarChatUnblockedForEveryone', (payload) => {
        // console.log('[ApiUser Private Channel] WebinarChatUnblockedForEveryone', payload);
        store.dispatch(webinarGetSuccess(payload))
      })
      // console.log('chatPresenceChannel', chatPresenceChannel)

  };

  wsSubscribeRoomChannel = (roomId) => {
    this.server.join(`room.${roomId}`)
      .listen('.RoomUpdated', (payload) => {
        // console.log('[RoomUpdated]', payload)
        store.dispatch(roomGetSuccess({ roomId, room: payload }))
      })

    // console.log('roomPresenceChannel', roomPresenceChannel)
  }

  wsSubscribeWebinarChannel = (webinarId) => {
    this.server.join(`webinar.${webinarId}`)
      .listen('.WebinarLayoutChange', (payload) => {
        // console.log('[WebinarLayoutChange]', payload)
        store.dispatch(webinarSetLayout({ id: webinarId, layout: payload.layout }))
      })
      .listen('.WebinarUpdated', (payload) => {
        // console.log('WebinarUpdated', payload)
        store.dispatch(webinarGetSuccess(payload))
      })
      .listen('.WebinarSlideOpen', (payload) => {
        // console.log('slide', payload)
        store.dispatch(webinarSetSlide({ id: webinarId, slide: payload }))
      })
      .listen('.WebinarTabChange', (payload) => {
        // console.log('WebinarTabChange', payload)
        store.dispatch(webinarChangeTabInChatSuccess({ id: webinarId, tab: payload.tab }))
        // store.dispatch(webinarSetSlide(payload))
      })

    // console.log('webinarPresenceChannel', webinarPresenceChannel)
  }
}

const webSocket = new WebSocketService()

export default webSocket
