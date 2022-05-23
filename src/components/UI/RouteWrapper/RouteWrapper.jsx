import React from 'react'
import PropTypes from 'prop-types'
import './RouteWrapper.scss'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const RouteWrapper = (props) => {
  const user = useSelector(state => state.app.user)
  const location = useLocation()

  const isInsideRoute = () => {
    return !location.pathname.includes('/product/:productId') && !location.pathname.includes('/signup')
  }

  return (
    <div className={`grid_container${(user.owner && isInsideRoute()) ? ' grid_container--menu' : ''}`}>
      <div className={`grid_content ${props.className}`}>
        {props.children}
      </div>
    </div>
  )
}

RouteWrapper.defaultProps = {
  className: ''
}

RouteWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default RouteWrapper
