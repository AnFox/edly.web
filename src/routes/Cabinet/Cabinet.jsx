import React, { useEffect } from 'react'
import './Cabinet.scss'
import Footer from "../../components/Footer"
import CabinetContent from "../../components/Cabinet"
import Header from "../../components/RoomsHeader"
import { useDispatch, useSelector } from "react-redux"
import { getUser } from "../../lib/app/user/actions"
import webSocket from "../../services/WebSocketService"
import RouteWrapper from '../../components/UI/RouteWrapper'

const Cabinet = () => {
  const user = useSelector(state => state.app.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUser()).then(() => {
      // Init websocket
      if (user.id) {
        webSocket.init()
        webSocket.wsSubscribePrivateChannel(user.id)
      }
    })

    return () => {
      // Destroy websocket on componentWillUnmount
      webSocket.destroy()
    }
  }, [dispatch, user.id])

  if (!user.id) {
    return <></>
  }

  return (
    <>
      <Header/>
      <RouteWrapper>
        <CabinetContent />
      </RouteWrapper>
      <Footer xs={7}/>
    </>
  )
}

export default Cabinet
