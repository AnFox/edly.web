import React, { useState } from 'react'
import './Products.scss'
import '../CommonStyles/CommonStylesForm.scss'
import '../CommonStyles/CommonStylesChat.scss'
import PropTypes from 'prop-types'
import PaymentWindow from '../PaymentWindow/PaymentPopUp'
import { useSelector } from "react-redux"
import Banner from "../Banner"

const Products = (props) => {
  const [openPayment, setOpenPayment] = useState(false)
  const [changeBanner, setChangeBanner] = useState(false)
  const banners = useSelector(state => state.app.webinar[props.webinarId].banners || [])

  const EachBanner = (banner, i) => {
    return (
      <React.Fragment key={i}>
        <Banner banner={banner}/>
      </React.Fragment>
    )
  }

  const RenderBannerProducts = () => banners && banners.filter((banner) => banner.is_visible).map(EachBanner)

  return (
    <>
      <PaymentWindow open={openPayment} setOpenPayment={setOpenPayment} bannerId={changeBanner}/>
      <div className="products_list">
        {RenderBannerProducts()}
      </div>
    </>
  )
}

Products.propTypes = {
  webinarId: PropTypes.number.isRequired
}

export default Products
