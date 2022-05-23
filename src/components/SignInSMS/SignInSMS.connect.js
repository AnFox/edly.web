import {connect} from 'react-redux';

import {authRegister} from '../../lib/auth/actions';
import SignInSMS from "./SignInSMS";

export default connect(null, {
  authRegister,
})(SignInSMS);
