import React from 'react'
import { Grid } from '@material-ui/core'
import './AuthScreen.scss'
import Footer from "../../components/Footer"
import AuthForm from "../../components/AuthForm"

const AuthScreen = (props) => {
  return (
    <>
      <Grid className="body_auth_main" container justify="center">
        <Grid className="grid_options" item xs={6} >
          <AuthForm {...props} />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default AuthScreen
