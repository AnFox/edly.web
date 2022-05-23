import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './AdminChat.scss'
import '../CommonStyles/CommonStylesForm.scss'
import '../CommonStyles/CommonStylesChat.scss'
import { CloseIcon, Banner, Smile, Send } from '../UI/Icons/Icons'
import Emoji from '../Emoji'
import Toggle from '../UI/Toggle'
import { useDispatch } from 'react-redux'
import { toggleBannerVisibility } from '../../lib/admin/banner/actions'

const ChatFooter = (props) => {
  const [message, setMessage] = useState('')
  const banners = props.banners
  const dispatch = useDispatch()

  const sendBanner = (idBanners) => {
    props.submitMessage(null, props.toWhom, idBanners)
    props.setShowBanners(false)
  }

  const changeShowBanner = (banner) => {
    dispatch(toggleBannerVisibility(props.webinar.id, banner.id, { is_visible: !banner.is_visible }))
  }

  const messageRef = useRef('')
  const sendMessage = () => {
    if ((props.webinar.adminable || props.webinar.moderatable) || !props.block) {
      if (message) {
        props.submitMessage(message, props.toWhom)
        props.setToWhom({ name: 'Всем', id: null })
        setMessage('')
        messageRef.current = ''
        props.hideSmile()
      }
    }
  }

  const onEmojiSelect = (emoji) => {
    setMessage(messageRef.current + emoji)
    messageRef.current = messageRef.current + emoji
    const inp = document.getElementById('input_mes')
    inp.focus()
    inp.selectionStart = inp.value.length
  }

  const editMessage = (e) => {
    setMessage(e.target.value)
    messageRef.current = e.target.value
  }

  const inputKeyPress = (e) => {
    if (e.shiftKey && e.charCode === 13) {
      return true
    }
    if (e.charCode === 13) {
      e.preventDefault()
      if (message && ((props.webinar.adminable || props.webinar.moderatable) || !props.block)) {
        props.submitMessage(message, props.toWhom)
        setMessage('')
        messageRef.current = ''
      }
      props.hideSmile()
      return false
    }
  }

  const EachBanner = (data, i) => {
    return (
      <div className="chat_input_banners__single" style={{ cursor: 'pointer' }} key={i}>
        <div
          className="chat_input_banners__single_img"
          onClick={() => sendBanner(data.id)} style={{ backgroundImage: `url(${data.image_url})` }}
        >
          <div style={{ marginBottom: '5px' }}>{data.title}</div>
          <div>{data.product !== null ? data.product.price : ''} {data.url}</div>
        </div>
        <div className="chat_input_banners_flex">
          <Toggle
            id={`chat_input_banners_toggle_${i}`}
            onSelect={() => changeShowBanner(data)}
            selected={data.is_visible}
            label="Отображать в комнате"
            classList="chat_input_banners__single_label"
          />
        </div>
      </div>
    )
  }

  const showBanner = () => banners && banners.map(EachBanner)

  return (
    <>
      <Emoji onSelect={onEmojiSelect} />
      <div className="chat_input_banners" id="input_banners" style={{ display: `${props.showBanners ? 'flex' : 'none'}` }}>
        <div className={'chat_input_banners__list'}>
          {showBanner()}
        </div>
      </div>
      <div className="chat_footer">
        <div className="chat_to_whom">
          <div className="chat_text">
                        Кому:&nbsp;<strong>{props.toWhom.name}</strong>
                        &nbsp;&nbsp;
            <CloseIcon style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => props.setToWhom({ name: 'Всем', id: null })}/>
          </div>
        </div>
        <div className="chat_footer_input_and_send">
          {props.moderator ? (
            <>
              <div className="chat_input_icon_admin">
                <input
                  type="text"
                  className="input_text chat_input"
                  placeholder="Type here..."
                  value={message}
                  id ="input_mes"
                  onChange={editMessage}
                  onKeyPress={inputKeyPress}
                />
                <div className="btn_chat_input_baner" id="chat_baner">
                  <Banner className="btn_chat_smile" onClick={() => { props.setShowBanners(!props.showBanners) }} />
                </div>
                <div className="chat_input_smile" >
                  <Smile onClick={props.showSmile} className="btn_chat_smile"/>
                </div>
                <div className="chat_input_send" >
                  <Send className="btn_chat_send" onClick={sendMessage} />
                </div>
              </div>
            </>
          ) : (
            <div className="chat_footer_input_and_send">
              <div className="chat_input_icon">
                <input
                  type="text"
                  className="input_text chat_input"
                  placeholder="Type here..."
                  id="input_mes"
                  value={message}
                  disabled={props.block}
                  onChange={editMessage}
                  onKeyPress={inputKeyPress}
                />
                <div className="chat_input_smile" >
                  <Smile onClick={!props.block ? props.showSmile : null} className="btn_chat_smile"/>
                </div>
                <div className="chat_input_send" >
                  <Send className="btn_chat_send" onClick={sendMessage} />
                </div>
              </div>
            </div>
          )}

        </div>
        {/*<div className="label_block_chat">{props.block ? 'Чат временно заблокирован модератором' : ''}</div>*/}
      </div>
    </>
  )
}

ChatFooter.propTypes = {
  banners: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    is_visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string,
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      currency: PropTypes.shape({
        sign: PropTypes.string.isRequired
      }).isRequired
    })
  })),
  webinar: PropTypes.shape({
    id: PropTypes.number.isRequired,
    adminable: PropTypes.bool.isRequired,
    moderatable: PropTypes.bool.isRequired
  }).isRequired,
  submitMessage: PropTypes.func.isRequired,
  toWhom: PropTypes.object,
  setToWhom: PropTypes.func,
  setShowBanners: PropTypes.func,
  showSmile: PropTypes.func,
  showBanners: PropTypes.bool,
  message: PropTypes.any,
  block: PropTypes.bool,
  moderator: PropTypes.bool,
  hideSmile: PropTypes.func.isRequired,
}

export default ChatFooter
