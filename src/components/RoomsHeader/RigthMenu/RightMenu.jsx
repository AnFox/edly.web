import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './RightMenu.scss'
import { Cabinet, CashBox, CloseIcon, OutIcon, WebinarIcon } from '../../UI/Icons/Icons'
import { Link } from 'react-router-dom'
import Button from '../../UI/Button'
import PaymentWindow from '../../PopupPutInDeposit'
import { useDispatch, useSelector } from 'react-redux'
import { createAccountBalanceRefillOrder } from '../../../lib/app/orders/actions'
import { authLogout } from '../../../lib/auth/actions'

const RightMenu = (props) => {
  const dispatch = useDispatch()
  const [openPayment, setOpenPayment] = useState(false)
  const user = useSelector(state => state.app.user)
  const { text, open, closeMenu } = props


  const deposit = (amount) => {
    dispatch(createAccountBalanceRefillOrder(amount))
      .then((order) => {
        if (order) {
          const widget = new window.cp.CloudPayments()
          widget.charge(order,
            function () { // success
              // действие при успешной оплате
              setOpenPayment(false)
            },
            function (reason, options) { // fail
              // действие при неуспешной оплате
            })
        }
      })
  }

  const logout = () => {
    dispatch(authLogout())
  }

  return (
    <div className={`header_main_right_menu ${open ? 'selected' : ''}`} id="header_main_right_menu" tabIndex={7}>
      <div className="header_main_right_menu_content">
        <div className="header_main_right_menu_content_header">
          <div>
            {user.first_name}
          </div>
          <CloseIcon className="header_main_area_nav_menu_icon pointer" onClick={closeMenu} />
        </div>
        {/*<div className="header_main_right_menu_content_link_list">*/}
        {/*  */}

        {/*</div>*/}
        {!user.owner && <Link className="header_main_area_nav_menu_option header_main_area_nav_menu_option--rooms" name="header_main_area_nav_menu_rooms" to={user.owner ? '/rooms' : '/webinars'}>
          <WebinarIcon className="header_main_area_nav_menu_icon" />
          {user.owner ? text.rooms : text.webinars}
        </Link>}
        {user.account && (
          <div className="header_main_area_nav_menu_balance header_main_area_nav_menu_balance_right_menu">
            {text.balance}:&nbsp;<span style={{ color: (user.account.balance || 0) > 0 ? '#00E096' : '#FF3D71' }}>{user.account.balance} <span className="monetary_unit">₽</span></span>
          </div>
        )}

        {(user.account && user.email_verified_at) && (
          <>
            <Button onClick={() => setOpenPayment(true)} color="green" size="small" label={text.deposit} />
            {openPayment ? <PaymentWindow hide={() => setOpenPayment(false)} accept={deposit} /> : null}
          </>
        )}

        {user.account && (
          <>
            <Link className="header_main_area_nav_menu_option header_main_right_menu_link" to="/cabinet" >
              <Cabinet className="header_main_area_nav_menu_icon" />
              {text.privateCabinet}
            </Link>
            <Link className="header_main_area_nav_menu_option header_main_right_menu_link" name="header_main_area_nav_menu_cashbox" to="/cashbox">
              <CashBox className="header_main_area_nav_menu_icon" />
              {text.cashBox}
            </Link>
          </>
        )}

        <div className="header_main_area_nav_menu_option header_main_area_nav_menu_option--out" onClick={logout} >
          <OutIcon className="header_main_area_nav_menu_icon" />
          {text.out}
        </div>
        <div className="header_main_right_menu_line"/>

      </div>
    </div>
  )
}

RightMenu.propTypes = {
  text: PropTypes.shape({
    rooms: PropTypes.string,
    webinars: PropTypes.string,
    cashBox: PropTypes.string,
    balance: PropTypes.string,
    deposit: PropTypes.string,
    privateCabinet: PropTypes.string,
    out: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired
}

export default RightMenu
