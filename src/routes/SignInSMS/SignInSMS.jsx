import React from 'react'
import { Grid } from '@material-ui/core'
import './SignInSMS.scss'
import SignInSMSForm from "../../components/SignInSMS"
import Footer from "../../components/Footer"

const SignInSMS = () => {
  const enterRoom = () => {
    // in
  }
  return (
    <>
      <Grid className="body_auth_main" container justify="center">
        <Grid className="grid_options" item xs={6} >
          <SignInSMSForm enterRoom={enterRoom}/>
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default SignInSMS
