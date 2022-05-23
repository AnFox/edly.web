import React from 'react'
import './Product.scss'
import Button from '../UI/Button'
import PropTypes from 'prop-types'
import { File } from '../UI/Icons/Icons'
import { nl2el } from "../../utils/strings"

const text = {
  getTariff: 'Ознакомиться с полным описанием тарифа',
  unit: '₽',
  button: 'Купить'
}

const Product = (props) => {
  return (
    <div className="product_page">
      <div className="product_page_title">{props.purchaseSuccess ? props.title : props.product.name}</div>
      {!props.purchaseSuccess &&
        <>
          <div className="product_page_description">
            {
              props.product.description
                ? nl2el(props.product.description, 'div', { className: 'product_page_description_line' })
                : ''
            }
          </div>
          {props.getTariff && (
            <div onClick={props.getTariff} className="product_page_get_tariff">
              <div className="product_page_get_tariff_circle">
                <File/>
              </div>
              <div>{text.getTariff}</div>
            </div>
          )}

          {props.product.price && (
            <>
              <div className="product_page_line"/>
              <div className="product_page_price">{props.product.price ? props.product.price : ''} <span className="monetary_unit">{text.unit}</span></div>
              <Button size="big" color="green" label={text.button} onClick={props.onBuy}/>
            </>
          )}
        </>}
    </div>
  )
}

Product.propTypes = {
  product: PropTypes.shape({
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    name: PropTypes.string
  }),
  title: PropTypes.string,
  onBuy: PropTypes.func.isRequired,
  getTariff: PropTypes.func,
  purchaseSuccess: PropTypes.bool.isRequired
}

export default Product
