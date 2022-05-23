import React, { useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import ReactList from 'react-list'
import ProductInChat from '../Products/ProductsInChat'
import './AdminChat.scss'
import '../CommonStyles/CommonStylesForm.scss'
import '../CommonStyles/CommonStylesChat.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getChatMessages, unblockChatForEveryone } from '../../lib/app/chat/actions'
import Message from './Message'
import { WebinarTypeTabsInChat } from '../../dict/webinar'
import useScreenInfo from '../../utils/useScreenInfo'
import { ArrowDown, Unlock } from '../UI/Icons/Icons'
import Button from '../UI/Button'

const MessageList = (props) => {
  const screenInfo = useScreenInfo()
  const dispatch = useDispatch()
  const user = useSelector(state => state.app.user)
  const messages = useSelector(state => state.app.chat?.[props.webinar.id]?.messages || [])
  const pagination = useSelector(state => state.app.chat?.[props.webinar.id]?.pagination)
  const isBottomEndChat = useRef(false)
  const isTouched = useRef(false)
  const scrollContainer = useRef({})
  const buttonToDownChat = useRef({})
  const reactList = useRef({})
  const loading = useRef(false)

  useEffect(() => {
    buttonToDownChat.current = document.querySelector('.chat_list__button_down')
  }, [])

  const getMessageHeight = useCallback((index) => {
    const getLetters = () => {
      const width = window.innerWidth
      if (width <= 415) {
        return 40
      }
      if (width> 415 && width <= 768) {
        return 70
      }
      if (width > 768 && width < 1280) {
        return (scrollContainer.current.offsetWidth - 30 - 40 - 24) / 12
      }
      if (width > 1280) {
        return 45
      }
    }

    const fontSizeMessage = 21
    const messageHeader = messages[index].recipient_user_id ? 26 : fontSizeMessage
    const marginBetween = 5
    const id = messages[index].id
    const messageContainer = document.getElementById(`chatMessageId${id}`)

    if (messageContainer) {
      return Math.ceil(messageContainer.offsetHeight + 1)
    }

    if (messages[index].banner) {
      return window.innerWidth > 415 ? 160 : 147
    } else {
      return (fontSizeMessage * Math.ceil(messages[index].text.length / getLetters())) + (20 + marginBetween + messageHeader + 10)
    }
  }, [messages])

  const changeButtonState = () => {
    buttonToDownChat.current.style.display = isBottomEndChat.current ? 'none' : 'flex'
  }

  const isBottomEnd = useCallback(() => {
    const originalHeight = scrollContainer.current.scrollHeight - scrollContainer.current.clientHeight
    const isBottom = Math.ceil(scrollContainer.current.scrollTop) + 20 >= originalHeight - (messages.length ? getMessageHeight( messages.length - 1) / 2 : 0)
    isBottomEndChat.current = isBottom
    changeButtonState()
    return isBottom
  }, [getMessageHeight, messages.length])

  const isEndList =  () => {
    if (reactList.current.getVisibleRange && reactList.current.getVisibleRange()[0] < 5) {
      loadPrevious(pagination)
    }
    if (isBottomEnd()) {
      isTouched.current = false
    }
  }

  useEffect(() => {
    const moveDownMessageList = () => {
      const isUserSender = messages.length ? user.id === messages[messages.length - 1].sender_user_id : false
      if (reactList.current && reactList.current.scrollTo) {

        if (isUserSender) {
          reactList.current.scrollTo(messages.length)

        } else {
          if (!isTouched.current && isBottomEndChat.current) {
            reactList.current.scrollTo(messages.length)

          }
        }
      }
      isBottomEnd()
    }
    moveDownMessageList()
  }, [isBottomEnd, messages, user.id])

  const loadPrevious = (pagination) => new Promise((resolve) => {
    if (loading.current || !props.webinar?.chat_id) {
      return
    }
    loading.current = true
    if (pagination && pagination.current_page > 1) {
      dispatch(
        getChatMessages(props.webinar.id, props.webinar.chat_id, pagination.current_page - 1))
        .then(() => {
          loading.current = false
          resolve(true)
        })
        .catch(() => resolve(false))
    }
  })

  const unblockChat = () => {
    dispatch(unblockChatForEveryone(props.webinar.chat_id))
  }

  const MessageListItem = (index, key) => {
    return <React.Fragment key={key}>
      <Message
        isScrolling={false}
        messageIdList={props.messageIdList}
        message={messages[index]}
        index={index}
        setToWhom={props.setToWhom}
        checkMessage={props.checkMessage}
        webinarId={props.webinar.id}
      />
    </React.Fragment>
  }


  const isDisabled = () =>  (
    <>
      {!props.webinar.chat_enabled &&
    <div className="chat_list_block">
      <Unlock className="chat_list_block_icon"/>
      <span>Чат заблокирован</span>
      {(props.webinar.adminable || props.webinar.moderatable) &&
      <Button
        size="small"
        className="button_webinar"
        color="green"
        onClick={unblockChat}
      >
        <Unlock/>
        Разблокировать
      </Button>}
    </div>}
    </>
  )

  return (
    <div>
      <div className="chat_banners_list_main"
        style={{ display: props.webinar.tabInChat === WebinarTypeTabsInChat.PRODUCTS && screenInfo.width < 900 ? 'block' : 'none' }}>
        <ProductInChat webinarId={props.webinar.id}/>
      </div>
      <div
        className="chat_list"
        id="chat_window"
        style={{ display: props.webinar.tabInChat === WebinarTypeTabsInChat.CHAT || screenInfo.width > 900 ? 'block' : 'none' }}
      >
        {isDisabled()}
        <Button
          className={'chat_list__button_down'}
          size={'small'}
          onClick={() => reactList.current.scrollTo(messages.length)}
        >
          <ArrowDown />
        </Button>
        <div className={'chat_list__messages'}
          ref={scrollContainer}
          onMouseDown={() => isTouched.current = true}
          onMouseUp={() => isTouched.current = false}
          onTouchStart={() => isTouched.current = true}
          onTouchCancel={() => isTouched.current = false}
          onTouchEnd={() => isTouched.current = false}
          onTouchMove={isEndList}
          onScroll={isEndList}
        >{messages.length > 0 && (
            <ReactList
              scrollParentGetter={() => document.querySelector('.chat_list__messages')}
              ref={reactList}
              itemRenderer={MessageListItem}
              length={messages.length}
              useTranslate3d={true}
              itemSizeGetter={getMessageHeight}
              initialIndex={messages.length - 1}
              threshold={1000}
              type={'variable'}
            />
          )}

        </div>
      </div>
    </div>
  )
}

MessageList.propTypes = {
  setToWhom: PropTypes.func,
  setChangeBanner: PropTypes.func,
  setOpenPayment: PropTypes.func,
  checkMessage: PropTypes.func.isRequired,
  user: PropTypes.object,
  webinar: PropTypes.shape({
    id: PropTypes.number,
    tabInChat: PropTypes.string,
    chat_id: PropTypes.number.isRequired,
    chat_enabled: PropTypes.bool,
    adminable: PropTypes.bool.isRequired,
    moderatable: PropTypes.bool
  }),
  messageIdList: PropTypes.arrayOf(PropTypes.number)
}

export default MessageList
