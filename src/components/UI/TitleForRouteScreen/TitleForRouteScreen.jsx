import React from 'react'
import PropTypes from 'prop-types'
import './TitleForRouteScreen.scss'

const TitleForRouteScreen = (props) => {
  return (
    <div id={props.id} name={props.name} style={props.style} className={`title_ui ${props.className}`}>
      {props.children}
    </div>
  )
}

TitleForRouteScreen.defaultProps = {
  style: {},
  className: '',
  children: undefined,
  id: undefined,
  name: undefined
}

TitleForRouteScreen.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  name: PropTypes.string
}

export default TitleForRouteScreen
