import React from 'react'
import { Grid } from '@material-ui/core'
import './SignInRoom.scss'
import SignInRoomForm from "../../components/SignInRoom"
import Footer from "../../components/Footer"

const SignInRoom = () => {
  const enterRoom = () => {
    // in
  }
  return (
    <>
      <Grid className="body_auth_main" container justify="center">
        <Grid className="grid_options" item xs={6} >
          <SignInRoomForm enterRoom={enterRoom}/>
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default SignInRoom
