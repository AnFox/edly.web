import React, { useState } from 'react'
import PaymentWindow from '../PaymentWindow/PaymentPopUp'
import PropTypes from 'prop-types'
import { useSelector } from "react-redux"
import './Products.scss'
import '../CommonStyles/CommonStylesForm.scss'
import '../CommonStyles/CommonStylesChat.scss'
import { addHttpProtocolIfRequired } from '../../utils/strings'

const Products = (props) => {
  const products = useSelector(state => state.app.webinar[props.webinarId].banners)
  const [openPayment, setOpenPayment] = useState(false)
  const [changeBanner, setChangeBanner] = useState(false)
  const EachProduct = (data, ind) => {
    if (data.is_visible){
      return(
        <div key={ind+290} style={{ backgroundImage: `url(${data.image_url})` }} className="product_for_chat">
          <div className="product_group">
            <div className="product_group_text">{data.title}</div>
            {data.product ? (
              <button onClick={() => {setChangeBanner(data.id); setOpenPayment(true)}} className="product_button">Купить за {data.product.price} <span className="monetary_unit">₽</span></button>
            ) : (
              <button onClick={() => {const url = addHttpProtocolIfRequired(data.url)
                window.open(url, 'bannerURL')}} className="product_button">Перейти</button>
            )}
          </div>
        </div>
      )
    }

  }

  const showMessage = () => products && products.map(EachProduct)

  return (
    <>
      <PaymentWindow open={openPayment} setOpenPayment={setOpenPayment} bannerId={changeBanner}/>
      <div className="products_list_for_chat">
        {showMessage()}
      </div>
    </>
  )
}

Products.propTypes = {
  webinarId: PropTypes.number.isRequired
}

export default Products
