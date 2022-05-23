import React, { useState } from 'react'
import { Setting, Label } from '../UI/Icons/Icons'
import './CashBox.scss'
import Common from '../CashboxCommon'
import Orders from '../CashboxOrders'
import Products from '../CashboxProducts'

const text = {
  title: 'Касса',
  common: 'Общие параметры',
  orders: 'Заказы',
  products: 'Товары'
}
const CashBox = () => {
  const [tab, setTab] = useState('Common')

  return(
    <div className="cashbox">
      <div className="cashbox_title">{text.title}</div>
      <div className="cashbox_content">
        <div className="cashbox_content_nav_menu">
          <div onClick={() => setTab('Common')} className={`cashbox_content_nav_menu_option ${tab === 'Common' ? 'cashbox_content_nav_menu_option_selected' : ''}`}><Setting />{text.common}</div>
          {/*<div onClick={() => setWindow(1)} className={`cashbox_content_nav_menu_option ${open[1] ? 'cashbox_content_nav_menu_option_selected' : ''}`}><Order />{text.orders}</div>*/}
          <div onClick={() => setTab('Products')} className={`cashbox_content_nav_menu_option ${tab === 'Products' ? 'cashbox_content_nav_menu_option_selected' : ''}`}><Label />{text.products}</div>
        </div>
        {tab === 'Common' ? <Common /> : null}
        {tab === 'Orders' ? <Orders /> : null}
        {tab === 'Products' ? <Products /> : null}
      </div>
    </div>
  )
}

export default CashBox
