import React from 'react'
import { Grid } from '@material-ui/core'
import PageForm from "../../components/Page_404"
import Footer from "../../components/Footer"

const Page_404 = () => (
  <>
    <Grid container justify="center">
      <Grid className="grid_options" item xs={6} >
        <PageForm />
      </Grid>
    </Grid>
    <Footer />
  </>
)

export default Page_404
