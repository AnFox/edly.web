import { connect } from 'react-redux';

import { authenticationNetwork, authNetworkConnect } from '../../lib/auth/actions';

import OAuth from './OAuth';

function mapStateToProps(state) {
  return {
    intendedUrl: state.navigation.intendedUrl,
  };
}

export default connect(mapStateToProps, {
  authenticationNetwork: authenticationNetwork,
  authNetworkConnect,
})(OAuth);
