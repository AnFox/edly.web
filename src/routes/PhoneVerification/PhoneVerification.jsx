import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core'
import './PhoneVerification.scss'
import Footer from "../../components/Footer"
import CodeVerification from "../../components/CodeVerification"
import Header from "../../components/RoomsHeader"
import { defaultRoute } from '../../lib/navigation'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PhoneVerification = () => {
  const history = useHistory()
  const user = useSelector(state => state.app.user)

  useEffect(() => {
    if (user.phone_verified_at) {
      history.goBack()
    }
  }, [history, user.phone_verified_at])

  const callback = () => {
    history.push(defaultRoute)
  }

  return (
    <>
      <Header/>
      <Grid className="body_auth_main" container justify="center">
        <Grid className="grid_options" item xs={6}>
          <CodeVerification callback={callback}/>
        </Grid>
      </Grid>
      <Footer/>
    </>
  )
}

export default PhoneVerification
