import React from 'react'
import './Message.scss'
import Banner from '../../Banner'
import { useSelector } from 'react-redux'
import { CheckBox, Message as MessageIcon } from '../../UI/Icons/Icons'
import PropTypes from 'prop-types'

const Message = (props) => {
  const { message, index, isScrolling, checkMessage, messageIdList } = props
  const isAdmin = useSelector(state => state.app.webinar[props.webinarId]?.adminable)
  const user = useSelector(state => state.app.user)
  const isModerator = useSelector(state => state.app.webinar[props.webinarId]?.moderatable)
  const authorUserId = useSelector(state => state.app.webinar[props.webinarId]?.author_user_id)

  const isChecked = (id) => !!~messageIdList.indexOf(id)

  const getAdminHeader = (moderator, author, date, recipient_user_id, recipient_name, sender_user_id) => {
    return (
      <div className={'admin_chat_message__header'}
        onClick={() => {
          if (user.id !== sender_user_id) {
            props.setToWhom({ name: author, id: sender_user_id })
          }
        }}>
        <span>
          <strong>{author} {moderator ? '[модератор]' : ''} </strong>
          &nbsp;&nbsp;
          {new Date(date).toLocaleTimeString().substr(0, 5)}
        </span>
        {recipient_user_id ? (
          <div className="admin_chat_message_flex_icon">
            &nbsp;
            <MessageIcon />
            <div
              className="admin_chat_message_recipient_name">{recipient_name}</div>
            &nbsp;
          </div>
        ) : ''}
      </div>
    )
  }

  const MessageListItemForAdmin = (data, i) => {
    const moderator = authorUserId === data.sender_user_id
    return (
      <React.Fragment key={i}>
        <div
          id={`chatMessageId${data.id}`}
          className={'admin_chat_message' + (isChecked(data.id) ? ' admin_chat_message__checked' : '')}
        >
          {getAdminHeader(moderator, data.author, data.date, data.recipient_user_id, data.recipient_name, data.sender_user_id)}
          <div className="checkbox_flex">
            {data.banner ? (
              <Banner
                banner={data.banner}
                context="chat"
                isScrolling={isScrolling}
                onClick={() => checkMessage(i, moderator, data.id)}
              />
            ) : (
              <div onClick={() => checkMessage(i, moderator, data.id)}
                className={`admin_chat_message_text ${moderator
                  ? 'admin_message_admin'
                  : ''}`}>
                {data.text}
              </div>
            ) }
            <div className="checkbox_flex">
              <CheckBox id={`chatMessageCheckboxId${data.id}`} className="checkbox_message" />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
  const MessageListItemForUser = (data, i) => {
    const moderator = authorUserId === data.sender_user_id
    if (data.banner) {
      return (
        <React.Fragment key={i}>
          <div id={`chatMessageId${data.id}`} className="chat_message"
            style={{ textAlign: 'left' }}>
            <strong>{data.author} {moderator
              ? '[модератор]'
              : ''}</strong>&nbsp;&nbsp;{new Date(
              data.date).toLocaleTimeString().substr(0, 5)}
            <Banner
              isScrolling={props.isScrolling}
              banner={data.banner}
              context="chat"
            />
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment key={i}>
          <div id={`chatMessageId${data.id}`} className="chat_message">
            <div onClick={() => {
              if (user.id !== data.sender_user_id) {
                props.setToWhom({ name: data.author, id: data.sender_user_id })
              }
            }}>
              <strong>{data.author} {moderator
                ? '[модератор]'
                : ''}{data.recipient_user_id ? (
                <>
                  &nbsp;
                  <svg className="chat_message_right_arrow" width="21"
                    height="21"
                    viewBox="0 0 21 21" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.875 13H16.2525L13.0763 16.815C13.0027 16.9035 12.9473 17.0056 12.9132 17.1155C12.8792 17.2253 12.867 17.3409 12.8776 17.4554C12.8989 17.6868 13.0113 17.9002 13.19 18.0488C13.3687 18.1973 13.5991 18.2687 13.8304 18.2474C14.0618 18.2261 14.2752 18.1137 14.4237 17.935L18.7987 12.685C18.8282 12.6432 18.8545 12.5994 18.8775 12.5538C18.8775 12.51 18.9213 12.4838 18.9388 12.44C18.9784 12.3397 18.9992 12.2329 19 12.125C18.9992 12.0171 18.9784 11.9103 18.9388 11.81C18.9388 11.7663 18.895 11.74 18.8775 11.6963C18.8545 11.6506 18.8282 11.6068 18.7987 11.565L14.4237 6.315C14.3415 6.21623 14.2385 6.1368 14.122 6.08235C14.0056 6.02791 13.8785 5.99979 13.75 6C13.5456 5.9996 13.3474 6.07081 13.19 6.20125C13.1014 6.27471 13.0282 6.36492 12.9745 6.46672C12.9208 6.56853 12.8877 6.67992 12.8772 6.79453C12.8666 6.90913 12.8787 7.02469 12.9129 7.1346C12.9471 7.2445 13.0026 7.34658 13.0763 7.435L16.2525 11.25H5.875C5.64294 11.25 5.42038 11.3422 5.25628 11.5063C5.09219 11.6704 5 11.8929 5 12.125C5 12.3571 5.09219 12.5796 5.25628 12.7437C5.42038 12.9078 5.64294 13 5.875 13Z"
                      fill="#222B45"/>
                  </svg>
                  &nbsp;
                  {user.id === data.recipient_user_id
                    ? 'мне'
                    : data.recipient_name}
                </>
              ) : ''} </strong>&nbsp;&nbsp;{new Date(
                data.date).toLocaleTimeString().substr(0, 5)}
            </div>
            <div
              className={`chat_message_text ${moderator
                ? 'message_admin'
                : ''} ${data.recipient_user_id ? 'message_personal' : ''}`}>
              {data.text}
            </div>
          </div>
        </React.Fragment>
      )
    }
  }
  return (
    (isAdmin || isModerator)
      ? MessageListItemForAdmin(message, index)
      : MessageListItemForUser(message, index)
  )
}

Message.propTypes = {
  checkMessage: PropTypes.func.isRequired,
  setToWhom: PropTypes.func.isRequired,
  index: PropTypes.number,
  messageIdList: PropTypes.arrayOf(PropTypes.number),
  isScrolling: PropTypes.bool,
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    sender_user_id: PropTypes.number.isRequired,
    recipient_user_id: PropTypes.number,
    text: PropTypes.string,
    banner: PropTypes.object,
    author: PropTypes.string,
    date: PropTypes.string.isRequired
  }).isRequired,
}

export default Message
