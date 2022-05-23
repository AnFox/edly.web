import React from 'react'
import { Grid } from '@material-ui/core'
import './RegistrationSuccess.scss'
import RegSuccessForm from "../../components/RegistrationSuccess"
import Footer from "../../components/Footer"

const RegistrationSuccess = () => {
  return (
    <>
      <Grid className="body_auth_main" container justify="center">
        <Grid className="grid_options" item xs={6} >
          <RegSuccessForm/>
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default RegistrationSuccess
