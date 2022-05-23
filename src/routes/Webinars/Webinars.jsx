import React, { useEffect } from 'react'
import './Webinars.scss'
import Footer from '../../components/Footer'
import Header from '../../components/RoomsHeader'
import WebinarsList from '../../components/WebinarsList'
import { useDispatch, useSelector } from 'react-redux'
import { getWebinarsVisited } from '../../lib/app/webinars/actions'
import { getAdminRooms } from '../../lib/admin/rooms/actions'
import RouteWrapper from '../../components/UI/RouteWrapper'

const text = {
  title: 'Вебинары',
  buttonCreateWebinar: 'Создать вебинар',
  emptyWebinars: 'Вы еще не создали ни одного вебинара.',
  rooms: 'Комнаты',
  singleWebinar: {
    export: 'Экспорт сценария',
    goTo: 'Перейти',
    registeredUsers: 'Количество записавшихся на вебинар',
    ID: 'ID',
    setting: 'Настройка вебинара'
  }
}

const Webinars = () => {
  const dispatch = useDispatch()
  const rooms = useSelector(state => state.admin?.rooms.rooms)
  const user = useSelector(state => state.app.user)

  useEffect(() => {
    dispatch(getWebinarsVisited())
  }, [dispatch])

  useEffect(() => {
    if (!rooms?.length && (user && user.owner)) {
      dispatch(getAdminRooms())
    }
  }, [rooms, user, dispatch])

  return (
    <>
      <Header/>
      <RouteWrapper>
        <WebinarsList
          text={text}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default Webinars
