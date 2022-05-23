import React, { useEffect, useState } from 'react'
import './WebinarsList.scss'
import {
  Camera,
  Download,
  Setting,
  HumanSuccess,
  Tab
} from '../UI/Icons/Icons'
import Button from '../UI/Button'
import '../UI/Input/input.scss'
import DropDownList from '../UI/DropdownList'
import 'react-datepicker/dist/react-datepicker.css'
import WebinarStatus from '../WebinarStatus'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { exportRoomVisitorsEmailToCSV, exportRoomVisitorsPhoneToCSV } from '../../lib/admin/rooms/actions'
import PaginationInRoomsList from './PaginationInRoomsList'
import { getWebinarsVisited } from "../../lib/app/webinars/actions"
import { getWebinars } from '../../lib/admin/webinars/actions'
import PopUpAddRoom from "../PopUpAddRoom"
import PopUpAddWebinar from "../PopUpAddWebinar"
import BackStickerButton from '../backStickerButton'

const WebinarsList = (props) => {
  const dispatch = useDispatch()
  const params = useParams()
  const getRoom = (state) => state.admin?.rooms.rooms.find(room => room.id === +params.roomsId)

  const [dropDown, setDropDown] = useState({ label: 'Действующие', value: 'current' })
  const { text } = props
  const [popUpAddWebinar, setPopUpAddWebinar] = useState(false)
  const room = useSelector(state => getRoom(state))
  const user = useSelector(state => state.app.user)
  const webinarsListOwned = useSelector(state => state.admin?.webinars.webinars)
  const webinarsListVisited = useSelector(state => state.app.webinars?.items)
  const ownerPagination = useSelector(state => state.admin?.webinars.pagination)
  const userPagination = useSelector(state => state.app.webinars?.pagination)
  const initialOptionsDropDown = user.owner
    ? [{ label: 'Действующие', value: 'current' }, { label: 'Завершенные', value: 'completed' }, { label: 'Просмотренные', value: 'viewed' }]
    : [{ label: 'Действующие', value: 'current' }, { label: 'Завершенные', value: 'completed' }]

  useEffect(() => {
    if (params.roomsId) {
      dispatch(getWebinars(params.roomsId))
    }
  }, [dispatch, params.roomsId])

  const onSelectDropDown = (data) => {
    setDropDown(data)
    // data.value - current/completed/viewed
    if (data.value !== dropDown.value && data.value !== 'viewed') {
      if (user.owner) {
        dispatch(getWebinars(params.roomsId, data.value, ownerPagination.current_page, ownerPagination.per_page))
      } else {
        dispatch(getWebinarsVisited(userPagination.current_page, userPagination.per_page, data.value))
      }
    }

  }

  const downloadDatabaseMembers = async (webinarId, slug) => {
    await getListEmails(webinarId, slug)
    await getListPhones(webinarId, slug)
  }

  const getListEmails = async (webinarId, slug) => {
    const res = await exportRoomVisitorsEmailToCSV(webinarId)
    return {
      data: res.data.data,
      filename: `${slug}_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}_emails.csv`
    }
  }

  const getListPhones = async (webinarId, slug) => {
    const res = await exportRoomVisitorsPhoneToCSV(webinarId)
    return {
      data: res.data.data,
      filename: `${slug}_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}_phones.csv`
    }
  }

  const isAdmin = (data) => {
    if (room) {
      return !!webinarsListOwned.find(webinar => webinar.id === data.id)
    } else {
      return false
    }
  }

  const eachWebinar = (data, i) => {
    const webinarUrl = data.url.slice(data.url.indexOf('webinar') - 1, data.url.length)
    const roomUrl = room?.url.slice(room.url.indexOf('webinar') - 1, room.url.length)

    return (
      <div className={`single_webinar ${isAdmin(data) ? '' : 'user'}`} tabIndex={i} key={i}>
        <WebinarStatus webinar={data} typeId={room && room.type_id} />
        <div className="single_webinar_flex">
          {!isAdmin(data) && <Link className="webinars_text single_webinar_flex_title" style={{ fontWeight: 'bold' }} to={isAdmin(data) ? webinarUrl : ''}>{data.name}</Link>}
          {isAdmin(data) ? (
            <div className="single_webinar_delete" />
          ) : (
            (!data.finished_at) && (
              <Link className="single_webinar_enter desktop" to={webinarUrl}>
                <Camera className="single_webinar_icon" />
                {text.singleWebinar.goTo}
              </Link>
            )
          )}
        </div>

        <div className="webinars_text_small webinars_text_id webinars_text_id_margin">
          <span>{text.singleWebinar.ID}: {data.id}</span>
          <div className="webinars_text single_webinar_registered">
            <HumanSuccess className="single_webinar_icon" />
            <div className="webinars_text_small registered_users">
              {text.singleWebinar?.registeredUsers}
            </div>
            {data.amountSubscribed}
          </div>
        </div>
        {isAdmin(data) ? (
          <>
            <div className="single_webinar_line" />
            <div className="single_webinar_buttons">
              {data.finished_at ? (
                <div className="webinars_text single_webinar_btn" onClick={() => downloadDatabaseMembers(data.id, data.slug)}>
                  <Download className="single_webinar_icon" />
                  {text.singleWebinar?.export}
                </div>
              ) : (
                <Link className="webinars_text single_webinar_btn" to={`/edit/webinar/${data.id}`}>
                  <Setting className="single_webinar_icon" />
                  {text.singleWebinar?.setting}
                </Link>
              )}
              <Link className="single_webinar_enter" to={{ pathname: roomUrl, state: { webinarId: data.id } }}>
                <Camera className="single_webinar_icon" />
                {text.singleWebinar?.goTo}
              </Link>
            </div>
          </>
        ) : null}
        {!isAdmin(data) && (
          <Link className="single_webinar_enter mobile" to={webinarUrl}>
            <Camera className="single_webinar_icon" />
            {text.singleWebinar?.goTo}
          </Link>
        )}

      </div>
    )
  }

  const showRooms = () => {
    if (user.owner) {
      if (dropDown.value === 'viewed') {
        return webinarsListVisited?.map(eachWebinar)
      } else {
        return webinarsListOwned?.map(eachWebinar)
      }
    } else {
      return webinarsListVisited?.map(eachWebinar)
    }

  }

  const [popUpAddRoom, setPopUpAddRoom] = useState(false)

  return (
    <div className="webinar_main">
      <div className="webinar_title">{text.title}</div>
      <div className="webinars_list">
        {user.owner &&
        <BackStickerButton to={'/rooms'}>
          <Tab /><span>{text.rooms}</span>
        </BackStickerButton>}
        <div className="webinars_list_main_buttons">
          {user.owner ? (
            <Button
              disabled={user.account && user.account.is_limited}
              onClick={() => setPopUpAddWebinar(true)}
              color="blue"
              size="medium"
              label={text.buttonCreateWebinar}
              className="webinars_list_btn"
            />
          ) : (
            <>
              <Button
                disabled={user.account && user.account.is_limited}
                onClick={() => setPopUpAddRoom(true)}
                color="blue"
                size="medium"
                label="Создать комнату"
                className="rooms_list_btn"
              />
              {/*{user.account && user.account.is_limited && (*/}
              {/*  <React.Fragment>*/}
              {/*    <Button onClick={() => setOpenPayment(true)} size="medium" className="rooms_list_btn" color="green" label="Пополнить счет" />*/}
              {/*    {openPayment ? <PaymentWindow hide={() => setOpenPayment(false)} accept={props.refillAccount} /> : null}*/}
              {/*  </React.Fragment>*/}
              {/*)}*/}
            </>
          )}

          <DropDownList
            onSelect={onSelectDropDown}
            selectedValue={dropDown.label}
            array={initialOptionsDropDown}
          />

        </div>
        {!webinarsListOwned?.length && user.owner ? (
          <div className="webinars_text webinars_list_text_options">
            {text.emptyWebinars}
          </div>
        ) : (
          <div className="webinars_list_flex">
            {showRooms()}
          </div>
        )}
        <PaginationInRoomsList roomsId={params.roomsId} dropDownValue={dropDown.value} owner={user.owner} />
      </div>
      <PopUpAddWebinar
        context={'WEBINARS_LIST'}
        popUpAddWebinar={popUpAddWebinar}
        setPopUpAddWebinar={setPopUpAddWebinar}
      />
      <PopUpAddRoom popUpAddRoom={popUpAddRoom} setPopUpAddRoom={setPopUpAddRoom} />
    </div>
  )
}

WebinarsList.propTypes = {
  text: PropTypes.object.isRequired
}

export default WebinarsList
