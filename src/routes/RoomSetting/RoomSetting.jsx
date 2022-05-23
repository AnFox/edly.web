import React from 'react'
import './RoomSetting.scss'
import Footer from '../../components/Footer'
import Header from '../../components/RoomsHeader'
import Setting from '../../components/RoomSetting'
import { useParams } from 'react-router-dom'
import RouteWrapper from '../../components/UI/RouteWrapper'
import { useSelector } from 'react-redux'

const RoomSetting = () => {
  const params = useParams()
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])

  return (
    <>
      <Header />
      <RouteWrapper>
        <div className="rooms_title">Настройки комнаты {room ? `"${room.name}"` : ''}</div>
        <Setting optionWindow={'editroom'} />
      </RouteWrapper>
      <Footer />
    </>
  )
}

export default RoomSetting
