import { connect } from 'react-redux';

import { authFinishRegister } from '../../lib/auth/actions';
import RegistrationFinishForm from './RegistrationFinishForm';

function mapStateToProps(state) {
  return {
    intendedUrl: state.navigation.intendedUrl,
    webinar: state.app.webinar,
  };
}

export default connect(mapStateToProps, {
  authFinishRegister
})(RegistrationFinishForm);
