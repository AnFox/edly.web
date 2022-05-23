import React from 'react'
import PropTypes from 'prop-types'
import {
  Earth,
  Tab,
} from '../../UI/Icons/Icons'

const Header = (props) => {
  return(
    <div className="rooms_admin_header">
      <div
        onClick={() => props.setOptionMenuHeader('rooms')}
        className={`rooms_menu_item ${props.optionMenuHeader === 'rooms' ? 'rooms_menu_item_selected' : ''}`}
      >
        <Tab style={{ marginRight: '10px' }} />
        <span className="rooms_admin_header_span">{props.text.adminRooms?.webinarRooms}</span>
      </div>
      {props.user.account && (
        <div onClick={() => props.setOptionMenuHeader('domain')} className={`rooms_menu_item ${props.optionMenuHeader === 'domain' ? 'rooms_menu_item_selected' : ''}`}>
          <Earth style={{ marginRight: '10px' }} />
          <span className="rooms_admin_header_span">{props.text.adminRooms?.commonSettings}</span>
        </div>
      )}
    </div>
  )
}

Header.propTypes = {
  setOptionMenuHeader: PropTypes.func.isRequired,
  optionMenuHeader: PropTypes.string,
  text: PropTypes.shape({
    adminRooms: PropTypes.shape({
      webinarRooms: PropTypes.string,
      commonSettings: PropTypes.string
    })
  }),
  user: PropTypes.shape({
    account: PropTypes.instanceOf(Object)
  }).isRequired
}

export default Header
