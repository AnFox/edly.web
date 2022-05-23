import React, { useEffect } from 'react'
import CheckPaymentContent from '../../components/CheckPayment'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import PropTypes from 'prop-types'
import { getUser } from '../../lib/app/user/actions'
import webSocket from '../../services/WebSocketService'
import { getWebinarsVisited } from '../../lib/app/webinars/actions'
import { getAdminRooms } from '../../lib/admin/rooms/actions'
import { useDispatch, useSelector } from 'react-redux'

const CheckPayment = (props) => {
  CheckPayment.propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        payment: PropTypes.shape({
          id: PropTypes.number.isRequired,
          order_id: PropTypes.number.isRequired,
          status: PropTypes.string.isRequired,
          paid: PropTypes.bool.isRequired,
          amount: PropTypes.number.isRequired,
          description: PropTypes.string.isRequired,
          fail_message: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  const { payment } = props.location.state

  const user = useSelector(state => state.app.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUser()).then(() => {
      // Init websocket
      if (user.id) {
        webSocket.init()
        webSocket.wsSubscribePrivateChannel(user.id)
      }

      dispatch(getWebinarsVisited()).then(() => {
        if (user && user.owner) {
          dispatch(getAdminRooms())
        }
      })
    })

    return () => {
      // Destroy websocket on componentWillUnmount
      webSocket.destroy()
    }
  }, [dispatch, user])

  return (
    <>
      <Header />
      <CheckPaymentContent payment={payment} />
      <Footer />
    </>
  )
}

export default CheckPayment
