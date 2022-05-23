import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from '@material-ui/core'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import './AdminChat.scss'
import '../CommonStyles/CommonStylesForm.scss'
import '../CommonStyles/CommonStylesChat.scss'
import { useDispatch, useSelector } from "react-redux"
import {
  banUserAndDeleteChatMessages,
  banUserOfChatMessages,
  blockUserForChatMessages,
  deleteChatMessages
} from "../../lib/app/chat/actions"
import { Lightning, CloseIcon } from "../UI/Icons/Icons"
import PopUp from "../UI/PopUp"
import { WebinarTypeTabsInChat } from '../../dict/webinar'
import { webinarChangeTabInChatSuccess } from '../../lib/app/webinar/actions'

const ChatHeader = (props) => {
  const dispatch = useDispatch()
  const webinar = useSelector(state => state.app.webinar[props.webinarId])
  const messages = useSelector(state => state.app.chat?.[props.webinarId]?.messages.filter((item) => ~props.messageIdList.indexOf(item.id)) || [])
  const [showPersonalMessages, setShowPersonalMessages] = useState(true)
  const [showFilterMessages, setShowFilterMessages] = useState(true)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteAndBanDialog, setShowDeleteAndBanDialog] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [showBlockChatDialog, setShowBlockChatDialog] = useState(false)

  const changeFilterMessages = () => {
    setShowFilterMessages(!showFilterMessages)
  }

  const changePersonalMessages = () => {
    // показывать личную переписку
    setShowPersonalMessages(!showPersonalMessages)
  }

  const banUser = () => {
    // в бан
    dispatch(banUserOfChatMessages(webinar.chat_id, props.messageIdList))
    props.clearChatModeration()
    setShowBanDialog(false)
  }

  const blockChatForUser = () => {
    // блокировать чат
    dispatch(blockUserForChatMessages(webinar.chat_id, props.messageIdList))
    props.clearChatModeration()
    setShowBlockChatDialog(false)
  }

  const deleteMessageAndBanUser = () => {
    // в удалить и бан
    dispatch(banUserAndDeleteChatMessages(webinar.id, webinar.chat_id, props.messageIdList))
    props.clearChatModeration()
    setShowDeleteAndBanDialog(false)
  }

  const deleteMessages = () => {
    dispatch(deleteChatMessages(webinar.id, webinar.chat_id, props.messageIdList))
    props.clearChatModeration()
    setShowDeleteDialog(false)
  }

  const changeTabInChat = useCallback((tab) => {
    dispatch(webinarChangeTabInChatSuccess({ id: props.webinarId, tab: tab }))
  }, [dispatch, props.webinarId])

  const onResize = useCallback(() => {
    if (window.innerWidth > 900 && (webinar.tabInChat !== WebinarTypeTabsInChat.CHAT)) {
      changeTabInChat(WebinarTypeTabsInChat.CHAT)
    }
  }, [changeTabInChat, webinar.tabInChat])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  const changeToProducts = () => {
    changeTabInChat(WebinarTypeTabsInChat.PRODUCTS)
    props.setOpenSmile(false)
    if (props.moderator) {
      props.setShowBanners(false)
    }
  }

  const toggleWindowInChat = () => (
    <div className="chat_header_mobile_buttons">
      <div
        className={`chat_header_mobile_btn ${webinar.tabInChat === WebinarTypeTabsInChat.CHAT ? 'chat_header_mobile_btn_selected' : ''}`}
        id="mobile_btn_left"
        onClick={() => changeTabInChat(WebinarTypeTabsInChat.CHAT)}
      >
        Чат {props.usersOnline}
      </div>
      <div
        className={`chat_header_mobile_btn ${webinar.tabInChat === WebinarTypeTabsInChat.PRODUCTS ? 'chat_header_mobile_btn_selected' : ''}`}
        id="mobile_btn_right"
        onClick={changeToProducts}
      >
        Товары
      </div>
    </div>
  )
  return (
    <>
      <div className="chat_header">
        <div className="chat_header_top_info_and_buttons">
          <div className="chat_header_mobile">
            {props.moderator ? (
              <>
                {toggleWindowInChat()}
                <div className="btn_secondary button_secondary_options button_secondary_moderate btn_moderate" onClick={() => props.setShowModerate(true)}>
                  <Lightning />
                  <div className="chat_header_mobile_btn_moderate_text">Модерация</div>
                </div>
              </>
            ) : (
              <>
                {toggleWindowInChat()}
              </>
            )}
          </div>
          <div className="chat_header_flex">
            <div className="chat_header_amount_of_people_admin">
              Человек в чате: <strong>{props.usersOnline}</strong>
            </div>
            {props.moderator ? (
              <div style={{ display: 'flex' }}>
                <button className="btn_border btn_chat_help_admin" onClick={() => props.openHelp(true)}>Помощь</button>
                <div className="btn_secondary button_secondary_options button_secondary_moderate" onClick={() => props.setShowModerate(true)}>
                  <Lightning />
                  <div className="">Модерация</div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex' }}>
                <button className="btn_border btn_chat_help_admin" onClick={() => props.openHelp(true)}>Помощь</button>
              </div>
            )}

          </div>

        </div>
        <div className="chat_header_bottom_line" />
      </div>
      {props.moderator && (
        <div className="chat_moderation" style={{ display: `${((props.messageIdList.length > 0) || props.showModerate) ? 'block' : 'none'}` }}>
          <div className="chat_moderation_header">
            <div className="chat_moderation_header_title">Модерация чата</div>
            <div>
              <CloseIcon className="close_setting_icon" onClick={props.clearChatModeration} style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div className="chat_moderation_checkbox_flex" style={{ marginBottom: '10px' }}>
            <Checkbox
              style={{ color: '#598BFF', backgroundColor: 'none', padding: '0', marginRight: '5px' }}
              checked={showFilterMessages}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              onChange={() => changeFilterMessages(props.messageIdList)}
              name="checkedB"
              color="primary"
            />
            <div className="">Показывать отфильтрованные сообщения</div>
          </div>
          <div className="chat_moderation_checkbox_flex">
            <Checkbox
              style={{ color: '#598BFF', backgroundColor: 'none', padding: '0', marginRight: '5px' }}
              checked={showPersonalMessages}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              onChange={() => changePersonalMessages()}
              name="checkedB"
              color="primary"
            />
            <div className="">Показывать личную переписку между зрителями</div>
          </div>
          <div className="chat_moderation_buttons">
            <div className="chat_moderation_buttons_label">Отмечено: <strong>{props.messageIdList.length}</strong></div>
            <button disabled={!props.messageIdList.length } className="btn_secondary button_secondary_options" onClick={() => setShowDeleteDialog(true)}>Удалить</button>
            <button disabled={!!((messages.find((message) => message.sender_user_id === props.user.id)) || (!props.messageIdList.length))} className="btn_secondary button_secondary_options" onClick={() => setShowDeleteAndBanDialog(true)}>Удалить + бан</button>
            <button disabled={!!((messages.find((message) => message.sender_user_id === props.user.id)) || (!props.messageIdList.length))} className="btn_secondary button_secondary_options" onClick={() => setShowBanDialog(true)}>Бан</button>
            <button disabled={!!((messages.find((message) => message.sender_user_id === props.user.id)) || (!props.messageIdList.length))} className="btn_secondary button_secondary_options" onClick={() => setShowBlockChatDialog(true)}>Блок чата</button>

          </div>
        </div>
      )}
      <PopUp
        show={showDeleteDialog}
        closePopUp={() => setShowDeleteDialog(false)}
        title={'Подтвердите'}
        showButtonCancel={true}
        showButtonAccept={true}
        buttonAcceptLabel={'Удалить'}
        buttonCancelLabel={'Отмена'}
        buttonAcceptColor="red"
        onAccept={deleteMessages}
        onCancel={() => setShowDeleteDialog(false)}
      >
        <div className="moderator_popup">
          <div className="alert_label">Удалить выбранные сообщения?</div>
        </div>
      </PopUp>
      <PopUp
        show={showDeleteAndBanDialog}
        closePopUp={() => setShowDeleteAndBanDialog(false)}
        title={'Подтвердите'}
        showButtonCancel={true}
        showButtonAccept={true}
        buttonAcceptLabel={'Удалить и забанить'}
        buttonCancelLabel={'Отмена'}
        buttonAcceptColor="red"
        onAccept={deleteMessageAndBanUser}
        onCancel={() => setShowDeleteAndBanDialog(false)}
      >
        <div className="moderator_popup">
          <div className="alert_label">Удалить выбранные сообщения и забанить их авторов?</div>
        </div>
      </PopUp>
      <PopUp
        show={showBanDialog}
        closePopUp={() => setShowBanDialog(false)}
        title={'Подтвердите'}
        showButtonCancel={true}
        showButtonAccept={true}
        buttonAcceptLabel={'Забанить'}
        buttonCancelLabel={'Отмена'}
        buttonAcceptColor="red"
        onAccept={banUser}
        onCancel={() => setShowBanDialog(false)}
      >
        <div className="moderator_popup">
          <div className="alert_label">Забанить авторов выбранных сообщений?</div>
          <div className="alert_label_info">(их сообщения удалены не будут)</div>
        </div>
      </PopUp>
      <PopUp
        show={showBlockChatDialog}
        closePopUp={() => setShowBlockChatDialog(false)}
        title={'Подтвердите'}
        showButtonCancel={true}
        showButtonAccept={true}
        buttonAcceptLabel={'Заблокировать'}
        buttonCancelLabel={'Отмена'}
        buttonAcceptColor="red"
        onAccept={blockChatForUser}
        onCancel={() => setShowBlockChatDialog(false)}
      >
        <div className="moderator_popup">
          <div className="alert_label">Заблокировать чат для авторов выбранных сообщений?</div>
          <div className="alert_label_info">(их сообщения удалены не будут)</div>
        </div>
      </PopUp>
    </>
  )
}

ChatHeader.propTypes = {
  openHelp: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  moderator: PropTypes.bool.isRequired,
  setShowBanners: PropTypes.func.isRequired,
  setOpenSmile: PropTypes.func.isRequired,
  setShowModerate: PropTypes.func.isRequired,
  clearChatModeration: PropTypes.func.isRequired,
  messageIdList: PropTypes.any.isRequired,
  showModerate: PropTypes.bool,
  usersOnline: PropTypes.number.isRequired,
  webinarId: PropTypes.number.isRequired
}

export default ChatHeader
