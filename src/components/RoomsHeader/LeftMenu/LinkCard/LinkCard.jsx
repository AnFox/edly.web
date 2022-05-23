import React from 'react'
import './LinkCard.scss'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const LinkCard = (props) => {
  const isActive = () => {
    if (props.paths) {
      return !!props.paths.find(path => window.location.pathname.includes(path))
    } else return (window.location.pathname === props.to)
  }

  return (
    <NavLink to={props.to} className={`nav_menu__nav_link nav_link${isActive() ? ' nav_link--active' : ''}`}>
      <div>{props.icon}</div>
      <span>{props.label}</span>
      {props.inProgress && <span className={'nav_link__progress'}>{'В разработке'}</span>}
    </NavLink>
  )
}

LinkCard.defaultProps = {
  to: '/'
}

LinkCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  inProgress: PropTypes.bool,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  paths: PropTypes.arrayOf(PropTypes.string)
}

export default LinkCard
