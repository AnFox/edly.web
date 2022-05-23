import React from 'react'
import PropTypes from 'prop-types'

import { Redirect, Route } from 'react-router-dom'
import RegistrationFinish from '../../routes/RegistrationFinish'

const RoutePrivate = ({ component: Component, isAuthenticated, redirectRoute, user, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated ? (
      user.first_name
        ? <Component {...props} />
        : <RegistrationFinish user={user} {...props}/>
    ) : (
      <Redirect
        to={{
          pathname: redirectRoute || '/register',
          state: { from: props.location }
        }}
      />
    ))
    }
  />
)

RoutePrivate.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({}),
  user: PropTypes.shape({
    first_name: PropTypes.string
  }),
  redirectRoute: PropTypes.string
}

RoutePrivate.defaultProps = {
  location: undefined
}

export default RoutePrivate
