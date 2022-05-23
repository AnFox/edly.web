import React from 'react'
import './WebinarSetting.scss'
import Footer from '../../components/Footer'
import Header from '../../components/RoomsHeader'
import Setting from '../../components/WebinarSetting'
import { useParams } from 'react-router-dom'
import RouteWrapper from '../../components/UI/RouteWrapper'

const WebinarSetting = () => {
  const params = useParams()

  return (
    <>
      <Header />
      <RouteWrapper>
        <div className="rooms_title">Настройки вебинара {params.webinarId}</div>
        <Setting />
      </RouteWrapper>
      <Footer />
    </>
  )
}

export default WebinarSetting
