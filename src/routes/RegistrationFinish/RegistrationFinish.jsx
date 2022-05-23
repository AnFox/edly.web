import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import './RegistrationFinish.scss'
import Footer from '../../components/Footer'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { defaultRoute } from '../../lib/navigation'
import { navigationSetIntendedUrl } from '../../lib/navigation/actions'
import { getWebinarInfoFromIntendedUrl } from '../../lib/auth/actions'
import RegistrationFormSuccess from '../../components/RegistrationForm/RegistrationFormSuccess'
import CodeVerification from '../../components/CodeVerification'
import RegistrationFormBalance from '../../components/RegistrationForm/RegistrationFormBalance'
import RegistrationFinishForm from '../../components/RegistrationFinishForm'
import webSocket from '../../services/WebSocketService'
import { getUser } from '../../lib/app/user/actions'
import PaymentWindow from '../../components/PopupPutInDeposit'

const RegistrationFinish = () => {
  const [codeSucces, setCodeSuccess] = useState(false)
  const history = useHistory()
  const intendedUrl = useSelector(state => state.navigation.intendedUrl)
  const user = useSelector(state => state.app.user)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    if (user && user.id) {
      webSocket.init()
      webSocket.wsSubscribePrivateChannel(user.id)
    }

    return () => {
      // Destroy websocket on componentWillUnmount
      webSocket.destroy()
    }
  }, [user])

  useEffect(() => {
    // code to run on component mount
    dispatch(getUser())
    if (location.state && location.state.from) {
      const pathname = location.state.from.pathname
      dispatch(navigationSetIntendedUrl(pathname))
      dispatch(getWebinarInfoFromIntendedUrl(pathname))
    }
  }, [dispatch, location])

  const register = () => {
    history.push(intendedUrl || defaultRoute)
  }

  const CodeVerificationSuccess = () => {
    localStorage.setItem('balance', JSON.stringify({ balance: true }))
    setCodeSuccess(true)
  }

  const getStep = () => {
    const res = JSON.parse(localStorage.getItem('balance'))
    if (!user.email_verified_at) {
      return <RegistrationFormSuccess  nextStep={null}/>
    }
    if (codeSucces || (res && res.balance === true)) {
      return <RegistrationFormBalance />
    }
    if (user.owner && !user.phone_verified_at) {
      return <CodeVerification callback={CodeVerificationSuccess} />
    }
    if (!user.first_name){
      return <RegistrationFinishForm register={register}/>
    }
  }

  return (
    <>
      <Grid container justify="center">
        <Grid className="grid_options" item xs={6}>
          {getStep()}
        </Grid>
      </Grid>
      <Footer/>
    </>
  )
}

export default RegistrationFinish
