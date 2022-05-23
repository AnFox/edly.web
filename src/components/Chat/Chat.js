import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './UserChat.scss'
import '../CommonStyles/CommonStylesForm.scss'
import '../CommonStyles/CommonStylesChat.scss'
import PaymentWindow from '../PaymentWindow/PaymentPopUp'
import Footer from './ChatFooter'
import MessageList from './MessageList'
import Header from './ChatHeader'
import { postChatMessages } from '../../lib/app/chat/actions'
import { useSelector, useDispatch } from 'react-redux'
import useScreenInfo from '../../utils/useScreenInfo'
import { WebinarTypeTabsInChat } from '../../dict/webinar'

const Chat = (props) => {
  const user = useSelector(state => state.app.user)
  // const chat = useSelector(state => state.app.chat?.[props.webinar.id] || [])
  const dispatch = useDispatch()
  const screenInfo = useScreenInfo()

  const [toWhom, setToWhom] = useState({ name: 'Всем', id: null })
  const [changeBanner, setChangeBanner] = useState('')
  const [openPayment, setOpenPayment] = useState(false)
  const [openSmile, setOpenSmile] = useState(false)

  // for moderate
  const [messageIdList, setMessageIdList] = useState([])
  const [showModerate, setShowModerate] = useState(false)
  // banners pop-up admin
  const [showBanners, setShowBanners] = useState(false)

  const checkMessage = (i, admin, idMessage) => {
    const tempArray = [...messageIdList]
    if (messageIdList.indexOf(idMessage) !== -1) {
      tempArray.splice(messageIdList.indexOf(idMessage), 1)
    } else {
      tempArray.push(idMessage)
    }
    setMessageIdList(tempArray)
  }

  const clearChatModeration = () => {
    setShowModerate(false)
    setMessageIdList([])
  }

  const hideSmile = () => {
    const emoji = document.getElementsByClassName('emoji_main')
    if (emoji[0]) {
      emoji[0].style.display = 'none'
    }
    setOpenSmile(false)
  }

  const showSmile = () => {
    const emoji = document.getElementsByClassName('emoji_main')
    const btn = document.getElementsByClassName('chat_input_smile')
    if (!openSmile) {
      const res = getCoords(btn[0])
      emoji[0].style.display = 'block'
      emoji[0].style.top = `${res.top - 200}px`
      if (document.documentElement.clientWidth < 416) {
        emoji[0].style.width = '100%'
        emoji[0].style.left = '0'
      } else {
        emoji[0].style.left = `${res.left - 300 + 60}px`
      }
      setOpenSmile(true)
    } else {
      emoji[0].style.display = 'none'
      setOpenSmile(false)
    }
  }

  const getCoords = (elem) => {
    const box = elem.getBoundingClientRect()
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
      right: box.right + window.pageXOffset
    }
  }

  const header = document.getElementById('webinar_header')
  const style = header ? window.getComputedStyle(header) : {}

  // для тестовой нагрузки чата, сообщения добавляется непосредственно в store
  // const test = () => {
  //   const message = {
  //     author: "Рон Уизли",
  //     banner: null,
  //     date: "2020-10-29T12:48:45.000000Z",
  //     id: 5762,
  //     is_banner: false,
  //     recipient_name: null,
  //     recipient_user_id: null,
  //     sender_user_id: 6,
  //     text: (new Date).getTime() + (new Date).toString() + (new Date).toString()
  //   }
  //   dispatch(chatMessageGetSuccess({ webinarId: props.webinar.id, message: message }))
  //   setTimeout(test, 500)
  // }

  const submitMessage = (textMessage, recipient, bannerId = null) => {
    const chatId = props.webinar.chat_id
    const webinarId = props.webinar.id
    if (bannerId) {
      dispatch(postChatMessages(webinarId, chatId, {
        banner_id: bannerId
      }))
    } else {
      dispatch(postChatMessages(webinarId, chatId, {
        message: textMessage,
        recipient_user_id: recipient.id
      }))
    }
  }

  const height = {
    height: screenInfo.width <= 415 ? `calc(${screenInfo.height}px - 200px - 44px)` : screenInfo.width <= 900 ? `calc(${screenInfo.height}px - 329px - 44px)` : `calc(100vh - ${style.height || 0} - ${style.marginBottom || 0})`
  }
  return (
    <>
      <PaymentWindow open={openPayment} setOpenPayment={setOpenPayment} bannerId={changeBanner}/>
      <div style={height} className="chat_main chat_main_height">
        <Header
          user={user}
          usersOnline={props.usersOnline}
          openHelp={props.openHelp}
          moderator={props.moderator}
          messageIdList={messageIdList}
          showModerate={showModerate}
          setShowModerate={setShowModerate}
          clearChatModeration={clearChatModeration}
          setShowBanners={setShowBanners}
          setOpenSmile={setOpenSmile}
          webinarId={props.webinar.id}
        />
        <MessageList
          {...props}
          messageIdList={messageIdList}
          user={user} checkMessage={checkMessage}
          setToWhom={setToWhom}
          setChangeBanner={setChangeBanner}
          setOpenPayment={setOpenPayment}
        />
        {(props.webinar.tabInChat === WebinarTypeTabsInChat.CHAT || screenInfo.width > 900) && <Footer
          {...props}
          submitMessage={submitMessage}
          block={Object.prototype.hasOwnProperty.call(props.webinar, 'chat_enabled') && props.webinar.chat_enabled === false}
          setShowBanners={setShowBanners}
          showBanners={showBanners}
          toWhom={toWhom}
          setToWhom={setToWhom}
          hideSmile={hideSmile}
          showSmile={showSmile}
        />}
      </div>
    </>
  )
}

Chat.propTypes = {
  block: PropTypes.bool.isRequired,
  webinar: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author_user_id: PropTypes.number.isRequired,
    chat_enabled: PropTypes.bool.isRequired,
    adminable: PropTypes.bool.isRequired,
    moderatable: PropTypes.bool.isRequired,
    video_id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    tabInChat: PropTypes.string,
    amountOnline: PropTypes.number.isRequired,
    chat_id: PropTypes.number.isRequired,
    chat: PropTypes.shape({
      id: PropTypes.number.isRequired
    })
  }).isRequired,
  openHelp: PropTypes.func.isRequired,
  moderator: PropTypes.bool,
  usersOnline: PropTypes.number.isRequired
}

export default Chat
