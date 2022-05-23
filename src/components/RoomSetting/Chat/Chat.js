import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import UserManager from '../../UsersManager'
import Footer from '../Footer'
import './Chat.scss'
import {
  exportRoomVisitorsEmailToCSV,
  exportRoomVisitorsPhoneToCSV,
  unblockAllWebinarUsersInList
} from '../../../lib/admin/rooms/actions'
import { useDispatch } from 'react-redux'

const Chat = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.room && props.room.blockedUsers) {
      setListBlocked(props.room.blockedUsers)
    }
  }, [props.room])

  const [listBlocked, setListBlocked] = useState([])

  const deleteInBlockList = (users) => {
    const idList = users.map(user => user.id)
    dispatch(unblockAllWebinarUsersInList(props.room.id, idList))
  }

  // @todo: Leave it here as we might use it again soon
  /* const clearListBlocked = () => {
    dispatch(unblockAllWebinarUsers(props.rooms.slug));
  }; */

  const getListEmails = async () => {
    const res = await exportRoomVisitorsEmailToCSV(props.room.id)
    return {
      data: res.data.data,
      filename: `${props.room.slug}_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}_emails.csv`
    }
  }

  const getListPhones = async () => {
    const res = await exportRoomVisitorsPhoneToCSV(props.room.id)
    return {
      data: res.data.data,
      filename: `${props.room.slug}_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}_phones.csv`
    }
  }

  return (
    <div className={props.webinarLocation
      ? 'setting_webinar_padding setting_webinar_chat'
      : 'setting_padding setting_chat'}>
      <UserManager
        listBlocked={listBlocked}
        getListEmails={getListEmails}
        getListPhones={getListPhones}
        deleteInBlockList={deleteInBlockList}
        classList={''}
        location='setting'
        roomId={props.room.id}
        className={props.webinarLocation ? 'webinar_block_list' : ''}
      />
      <Footer hideSaveButton={true} rollUp={props.rollUp} saveSetting={props.saveChatSetting}
        webinar={props.webinarLocation} text={props.text}/>
    </div>
  )
}

Chat.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired
  }),
  saveChatSetting: PropTypes.func.isRequired,
  rollUp: PropTypes.func,
  text: PropTypes.object,
  webinarLocation: PropTypes.bool
}

export default Chat
