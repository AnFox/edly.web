import React from 'react'
import PropTypes from 'prop-types'

import { Redirect, Route } from 'react-router-dom'

const RoutePublic = ({ component: Component, isAuthenticated, redirectRoute, ...rest }) => (
  <Route
    {...rest}
    render={props => (!isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: redirectRoute || '/',
          state: { from: props.location }
        }}
      />
    ))
    }
  />
)

RoutePublic.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({}),
  redirectRoute: PropTypes.string
}

RoutePublic.defaultProps = {
  location: undefined
}

export default RoutePublic
