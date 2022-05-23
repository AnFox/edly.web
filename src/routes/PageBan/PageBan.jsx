import React from 'react'
import { Grid } from '@material-ui/core'
import PageForm from "../../components/PageBan"
import Footer from "../../components/Footer"

const PageBan = () => {
  return(
    <>
      <Grid container justify="center">
        <Grid className="grid_options" item xs={6} >
          <PageForm />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default PageBan
