import React from "react"
import Card from "./Card"
import Grid from "@material-ui/core/Grid"
import Header from "../RoomsHeader"
import Footer from "../Footer"

export default function RequiredEmailVerification() {
  return (
    <>
      <Header/>
      <Grid container justify="center">
        <Card>
          <p>Чтобы войти на вебинар, пожалуйста, подтвердите Ваш Email.</p>
          <p>Ссылка для подтверждения Email находится в письме, которое мы отправили Вам при регистрации.</p>
        </Card>
      </Grid>
      <Footer xs={7}/>
    </>)
}
