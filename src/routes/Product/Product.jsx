import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductContent from '../../components/Product'
import { Link, useParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import './Product.scss'
import { getProductPublicInfo } from '../../lib/app/product/actions'
import { createProductOrder } from '../../lib/app/orders/actions'

const Product = () => {
  const dispatch = useDispatch()
  const { productId } = useParams()
  const productData = useSelector(state => state.app.product[productId])
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  useEffect(() => {
    dispatch(getProductPublicInfo(productId))
  }, [dispatch, productId])

  useEffect(() => {
    window.replainSettings = { id: 'b5c87b19-0afa-412e-81c5-a3194fd515c4' };
    (function (u) {
      const s = document.createElement('script')
      s.type = 'text/javascript'; s.async = true; s.src = u
      const x = document.getElementsByTagName('script')[0]
      x.parentNode.insertBefore(s, x)
    })('https://widget.replain.cc/dist/client.js')
    return () => widgetOff()
  }, [])

  const widgetOff = () => {
    const x = document.getElementsByTagName('script')[0]
    x.parentNode.removeChild(document.getElementsByTagName('script')[0])
    const elem = document.getElementById('__replain_widget')
    elem.parentNode.removeChild(elem)
  }



  const buy = () => {
    dispatch(createProductOrder(productId))
      .then((order) => {
        if (order) {
          const widget = new window.cp.CloudPayments()
          const options = {
            ...order,
            requireEmail: true
          }

          widget.charge(options,
            function (options) { // success
              // действие при успешной оплате
              setPurchaseSuccess(true)
              const { invoiceId, amount, description } = options
              window.gtag('event', 'purchase', {
                transaction_id: invoiceId,
                value: amount,
                items: [
                  {
                    name: description,
                    quantity: 1,
                    price: amount
                  }
                ]
              })
            },
            function (reason, options) { // fail
              // действие при неуспешной оплате
              setPurchaseSuccess(false)
            })
        }
      })
  }

  if (!(productData && productData.price)) {
    return <></>
  }

  return (
    <>
      <div className="product_container product_page_main">
        <div className="product_content relative">
          <Link className="product_page_logo" to="/">EDLY</Link>
          <ProductContent product={productData} purchaseSuccess={purchaseSuccess} onBuy={buy} title={'Спасибо за покупку!'}/>
        </div>

      </div>
      <div className="product_page_footer">
        <Footer/>
      </div>
    </>
  )
}

export default Product
