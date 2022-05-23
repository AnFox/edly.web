import React, { useEffect } from 'react'
import './Rooms.scss'
import Footer from '../../components/Footer'
import Header from '../../components/RoomsHeader'
import RoomsList from '../../components/AdminRoomsList'
import { useDispatch, useSelector } from 'react-redux'
import {
  delRoom,
  duplicateRoom,
  getAdminRooms,
  postGenerateSlug
} from '../../lib/admin/rooms/actions'
import { useHistory } from 'react-router-dom'
import { RequiredEmailVerification } from '../../components/UI'
import webSocket from '../../services/WebSocketService'
import { createAccountBalanceRefillOrder } from '../../lib/app/orders/actions'
import RouteWrapper from '../../components/UI/RouteWrapper'



const text = {
  idWebinar: 'ID',
  amountOnline: 'Количество зрителей онлайн',
  popUpButtonCancel: 'Отмена',
  of: 'из',
  buttonGenerate: 'Сгенерировать',
  goToTheWebinar: 'Перейти',
  more: {
    copyRoom: 'Копировать комнату',
    deleteRoom: 'Удалить комнату'
  },
  userRooms: {
    title: 'Ранее просмотренные вебинары'
  },
  adminRooms: {
    title: 'Комнаты',
    settingRoom: 'Настройка комнаты',
    hrefForUsers: 'Ссылка для зрителей',
    goToTheWebinar: 'Перейти в эфир',
    downloadMembers: 'База участников',
    commonSettings: 'Общие параметры',
    webinarRooms: 'Комнаты',
    limitedMessage: 'Чтобы создавать комнаты, пополните счет на 600 руб.',
    emptyRoomsMessage: {
      title: 'Вы еще не создали ни одной комнаты.',
      subtitle: 'Нажмите на вкладку "Создать комнату", чтобы добавить первую веб-комнату.'
    },
    parameters: {
      fbButton: 'Применить',
      fbDeleteButton: 'Удалить',
      fbText: 'Для отслеживания количества регистраций на вебинар создайте в настройках пикселя событие - CompleteRegistration'
    }
  },
  popUpCopyRoom: {
    title: 'Копировать комнату',
    buttonCopyRoom: 'Копировать',
    inputIdRoomTitle: 'Идентификатор комнаты',
    text: 'Указанный идентификатор будет использован в ссылке на комнату. Изменить идентификатор после создания нельзя!'
  },
  popUpDeleteRoom: {
    title: 'Подтвердите',
    subtitle: 'Вы собираетесь удалить комнату:',
    buttonDeleteRoom: 'Удалить',
    text: 'Произойдут следующие вещи:<br />- Все пользователи чата, находящиеся в комнате, будут разлогинены<br />- Будут удалены все настройки этой веб-комнаты<br />- Будут удалены все записи этой веб-комнаты<br />'
  },
  popUpOpenHref: {
    title: 'Ссылка для зрителей',
    inputHrefTitle: 'ссылка на домене сервиса',
    inputHrefSubtitle: 'Нажмите CTRL+C, чтобы скопировать ссылку в буфер',
    buttonCopyClipboard: 'Скопировать в буфер',
    text: 'По этой ссылке может войти кто угодно (потребуется ввести пароль, если вы его задали).',
    closeButton: 'Закрыть'
  },
  popUpEditDomain: {
    title: 'Подтвердите',
    subtitle: 'Вы собираетесь удалить комнату:',
    buttonCopyRoom: 'Удалить',
    text: 'Произойдут следующие вещи:<br />- Все пользователи чата, находящиеся в комнате, будут разлогинены<br />- Будут удалены все настройки этой веб-комнаты<br />- Будут удалены все записи этой веб-комнаты<br />'
  }
}

const Rooms = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector(state => state.app.user)

  useEffect(() => {
  // Нам не нужно получать здесь юзера вновь, так как он запрашивается в AuthForm
    if (user && user.id && user.owner && user.email_verified_at) {
      dispatch(getAdminRooms()).then(() => {
        webSocket.init()
        webSocket.wsSubscribePrivateChannel(user.id)
      })
    }
  }, [dispatch, user])

  useEffect(() => {
    return () => webSocket.destroy()
  }, [])

  const copyRoom = (idRoom, data) => {
    dispatch(duplicateRoom(idRoom, data))
  }

  const deleteRoom = (idRoom) => {
    dispatch(delRoom(idRoom))
  }

  const newDomain = () => {
    // @todo: Implement me
  }

  const generateId = async () => {
    return await dispatch(postGenerateSlug())
  }

  const Pay = function (amount) {
    dispatch(createAccountBalanceRefillOrder(amount))
      .then((order) => {
        if (order) {
          const widget = new window.cp.CloudPayments()
          widget.charge(order,
            function (options) { // success
              // действие при успешной оплате
            },
            function (reason, options) { // fail
              // действие при неуспешной оплате
            })
        }
      })
  }

  if (user.owner && user.phone && !user.phone_verified_at) {
    history.push('/verifyphone')
  }

  if (user.id && !user.verified) {
    return <RequiredEmailVerification/>
  }

  if (!user.id) {
    return <></>
  }

  if (!user.owner) {
    history.push('/webinars')
  }

  return (
    <>
      <Header/>
      <RouteWrapper>
        <RoomsList
          generateId={generateId}
          copyRoom={copyRoom}
          deleteRoom={deleteRoom}
          newDomain={newDomain}
          refillAccount={Pay}
          text={text}
        />
      </RouteWrapper>
      <Footer />
    </>
  )
}

export default Rooms
