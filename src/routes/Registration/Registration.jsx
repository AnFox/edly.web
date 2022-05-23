import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import './Registration.scss'
import RegistrationForm from '../../components/RegistrationForm'
import RegistrationFormLinkingSocialNetworks from '../../components/RegistrationForm/RegistartionFormLinkingSocialNetworks'
import Footer from '../../components/Footer'
import { useSelector } from 'react-redux'
import ReactPixel from 'react-facebook-pixel'
import { useLocation } from 'react-router-dom'

const Registration = () => {
  const [registrationStep, setRegistrationStep] = useState(1)
  const location = useLocation()
  const webinar = useSelector(state => state.app.webinar)

  useEffect(() => {
    const res = JSON.parse(localStorage.getItem('registration'))
    if (res) {
      setRegistrationStep(res.step)
    } else {
      localStorage.setItem('registration', JSON.stringify({ step: 1, timer: 60 }))
    }
    return () => {
      localStorage.removeItem('registration')
    }
  }, [])

  useEffect(() => {
    return () => {
      localStorage.removeItem('registration')
    }
  }, [location.pathname])





  const register = () => {
    if (webinar && webinar.fb_pixel) {
      ReactPixel.init(webinar.fb_pixel)
      ReactPixel.track('CompleteRegistration', {
        content_name: webinar.slug,
        status: true
      })
    }
    localStorage.setItem('registration', JSON.stringify({ step: 2 }))
    setRegistrationStep(2)
  }

  return (
    <>
      <Grid container justify="center">
        <Grid className="grid_options" item xs={6}>
          {registrationStep === 1 && <RegistrationForm register={register}/>}
          {registrationStep === 2 && <RegistrationFormLinkingSocialNetworks/>}
        </Grid>
      </Grid>
      <Footer/>
    </>
  )
}

export default Registration
