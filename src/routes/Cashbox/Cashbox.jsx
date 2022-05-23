import React from 'react'
import './Cashbox.scss'
import Footer from "../../components/Footer"
import CashboxContent from "../../components/Cashbox"
import Header from "../../components/RoomsHeader"
import { useDispatch, useSelector } from "react-redux"
import RouteWrapper from '../../components/UI/RouteWrapper'

const Cashbox = () => {

  return (
    <>
      <Header/>
      <RouteWrapper>
        <CashboxContent />
      </RouteWrapper>
      <Footer xs={7}/>
    </>
  )
}

export default Cashbox
