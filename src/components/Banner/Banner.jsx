import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createOrder } from '../../lib/app/orders/actions'
import { addHttpProtocolIfRequired } from '../../utils/strings'

const Banner = (props) => {
  const { banner } = props
  const dispatch = useDispatch()

  const Pay = function (productId, webinarId) {
    dispatch(createOrder(productId, webinarId))
      .then((order) => {
        if (order) {
          const widget = new window.cp.CloudPayments()
          widget.charge(order,
            function (options) { // success
              // действие при успешной оплате
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
            })
        }
      })
  }

  return (
    <div style={{ backgroundImage: !props.isScrolling ? `url(${banner.image_url})` : 'none', backgroundColor: props.isScrolling ? 'gray' : 'none' }} className={props.context ? `product_${props.context}` : 'product'}>
      <div className={props.context ? `product_group_${props.context}` : 'product_group'}>
        <div className={props.context ? `product_group_text_${props.context}` : 'product_group_text'}>{banner.title}</div>
        {banner.product ? (
          <button onClick={() => {
            Pay(banner.product.id, banner.room_id)
          }} className="product_button">Купить за {banner.product.price} {banner.product.currency.sign}</button>
        ) : (
          <button onClick={() => {
            const url = addHttpProtocolIfRequired(banner.url)
            window.open(url, 'bannerURL')
          }} className="product_button">Перейти</button>
        )}
      </div>
    </div>
  )
}

Banner.defaultProps = {
  context: '',
  onClick: null
}

Banner.propTypes = {
  banner: PropTypes.shape({
    room_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
    image_url: PropTypes.string.isRequired,
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      currency: PropTypes.shape({
        sign: PropTypes.string.isRequired
      }).isRequired
    })
  }).isRequired,
  isScrolling: PropTypes.bool,
  context: PropTypes.string,
  onClick: PropTypes.func
}

export default Banner
