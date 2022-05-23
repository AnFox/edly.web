import React, { Component } from 'react'
import PropTypes from 'prop-types'

import socialAuth from '../../services/SocialAuthService'

class OAuth extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        network: PropTypes.string,
        type: PropTypes.string,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({
      hash: PropTypes.string,
    }).isRequired,
    intendedUrl: PropTypes.string.isRequired,
    authenticationNetwork: PropTypes.func.isRequired,
    authNetworkConnect: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.handleSocialAuthCallback()
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.hash !== prevProps.location.hash) {
      this.handleSocialAuthCallback()
    }
  }

  handleSocialAuthCallback() {
    const { match: { params: { network, type } }, location: { hash }, intendedUrl } = this.props

    const response = socialAuth.parseResponse(hash)
    const data = {
      social_network_name: network,
      token: response.access_token,
      intendedUrl
    }

    if (type === 'login') {
      this.props.authenticationNetwork({
        ...data,
        remember_me: true,
      })
    } else {
      this.props.authNetworkConnect(data)
    }
  }

  render() {
    return <></>
  }
}

export default OAuth
