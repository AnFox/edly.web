import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '../UI/CheckBox'
import Button from '../UI/Button'
import { Download } from '../UI/Icons/Icons'
import ButtonBorder from '../UI/ButtonBorder'
import PopUp from '../UI/PopUp'
import './UsersManager.scss'
import DropdownList from "../UI/DropdownList"
import { useSelector } from "react-redux"
import { exportRoomVisitorsEmailAndPhoneToCSV } from "../../lib/admin/rooms/actions"
import { exportWebinarVisitorsEmailAndPhoneToCSV } from "../../lib/admin/webinars/actions"
import { CSVLink } from "react-csv"

const text = {
  dataBaseUsers: 'База участников',
  getListEmails: 'Скачать список эл. адресов',
  getListPhones: 'Скачать список телефонов',
  buttonUnblock: 'Разбанить',
  listBlockedUsers: 'Заблокированные пользователи',
  popUp: {
    title: 'Подтвердите',
    subtitle: 'Вы собираетесь разблокировать',
    buttonAccept: 'Разблокировать',
    buttonCancel: 'Отмена'
  }
}

const UserManager = (props) => {
  const [showPopUp, setShowPopUp] = useState(false)
  const [csvData, setCsvData] = useState(null)
  const csvInstance = useRef()
  const [listBlockedUsers, setListBlockedUsers] = useState(
    props.listBlocked || [])
  const [selectedWebinar, setSelectedWebinar] = useState({ label: 'Всех вебинаров', value: 'all' })
  const room = useSelector(state => state.admin.rooms.currentRoom[props.roomId])

  useEffect(() => setListBlockedUsers(props.listBlocked), [props])

  const handleCheck = (i) => {
    const temp = [...listBlockedUsers]
    if (temp[i].checked) {
      temp[i].checked = !temp[i].checked
    } else {
      temp[i].checked = true
    }
    setListBlockedUsers(temp)
  }

  const eachUnblock = (data, i) => {
    if (data.checked) {
      return (
        <span key={i}
          className="unblock_note">{`${data.first_name}: ${data.email}`}</span>
      )
    } else {
      return null
    }
  }

  const showUnblockList = () => listBlockedUsers &&
    listBlockedUsers.map(eachUnblock)

  const deleteInBlockList = () => {
    setShowPopUp(false)
    const list = listBlockedUsers.filter((user) => user.checked)
    // list - массив выделенных юзеров
    props.deleteInBlockList(list)
  }

  const eachList = (data, i) => {
    return (
      <div className="list_one" key={i}>
        <CheckBox checked={data.checked} onCheck={() => handleCheck(i)}
          label={`${data.first_name}: ${data.email}`}/>
      </div>
    )
  }

  const showList = () => listBlockedUsers && listBlockedUsers.map(eachList)

  const getArrayWebinars = () => {
    let array = []
    array.push({ label: 'Всех вебинаров', value: 'all' })
    if (room.webinars) {
      array = [...array, ...room.webinars.map(webinar => {
        return {
          label: `${webinar.starts_at.slice(0, 10)} ${webinar.starts_at.slice(12, 19)}`,
          value: webinar.id
        }
      })]
      return array
    } else {
      return []
    }
  }

  useEffect(() => {
    const getCsv = () => {
      if (csvInstance.current.link) {
        csvInstance.current.link.click()
        setCsvData(null)
      }
    }
    let timer = null
    if (csvData) {
      timer = setInterval(getCsv, 200)
    }
    return () => clearInterval(timer)
  }, [csvData, csvInstance])

  const downloadDatabaseMembers = async () => {
    if (selectedWebinar.value === 'all') {
      const res = await exportRoomVisitorsEmailAndPhoneToCSV(room.id)
      const data = {
        data: res.data.data,
        filename: `${room.slug}_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}_phone_&_email.csv`
      }
      setCsvData(data)
    } else {
      const res = await exportWebinarVisitorsEmailAndPhoneToCSV(selectedWebinar.value)
      const data = {
        data: res.data.data,
        filename: `${room.slug}_webinar_${selectedWebinar.value}_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}_phone_&_email.csv`
      }
      setCsvData(data)
    }
  }

  return (
    <div className={`block_main ${props.className ? props.className : ''}`}>
      {csvData && (
        <CSVLink
          data={csvData.data}
          headers={csvData.headers}
          filename={csvData.filename}
          ref={csvInstance}
        />
      )}
      <div className="block_main_list_box">
        <div className="block_label">{text.listBlockedUsers}</div>
        <div className="block_list">
          {showList()}
        </div>
        {props.location === 'setting' ? (
          <ButtonBorder disabled={!(listBlockedUsers && listBlockedUsers.length)} size="medium" label={text.buttonUnblock}
            onClick={() => setShowPopUp(true)}/>
        ) : (
          <Button/>
        )}
      </div>
      <div className="block_main_buttons_box">
        <div className="block_label">{text.dataBaseUsers}</div>
        <div className="block_main_buttons_box_download">
          <div className="download_members">
            <DropdownList selectedValue={selectedWebinar.label} onSelect={(value) => setSelectedWebinar(value)} array={getArrayWebinars()} />
          </div>
          <div className="btn_download_members" onClick={() => room.webinars.length ? downloadDatabaseMembers() : null}>
            <Download className="btn_download_members_icon" />
            {'Скачать'}
          </div>
        </div>

      </div>
      <PopUp
        show={showPopUp}
        closePopUp={setShowPopUp}
        title={text.popUp?.title}
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptSize="medium"
        buttonCancelSize="medium"
        buttonCancelType="border"
        onAccept={deleteInBlockList}
        onCancel={() => setShowPopUp(false)}
        buttonAcceptLabel={text.popUp?.buttonAccept}
        buttonCancelLabel={text.popUp?.buttonCancel}
      >
        <div className="block_label" style={{
          textTransform: 'none',
          fontSize: '14px',
          letterSpacing: 0
        }}>{text.popUp?.subtitle}</div>
        <div className="unblock_list">
          {showUnblockList()}
        </div>
      </PopUp>
    </div>
  )
}

UserManager.propTypes = {
  getListEmails: PropTypes.func.isRequired,
  getListPhones: PropTypes.func.isRequired,
  listBlocked: PropTypes.array.isRequired,
  deleteInBlockList: PropTypes.func.isRequired,
  classList: PropTypes.string,
  location: PropTypes.string,
  className: PropTypes.string,
  roomId: PropTypes.number.isRequired
}

export default UserManager
