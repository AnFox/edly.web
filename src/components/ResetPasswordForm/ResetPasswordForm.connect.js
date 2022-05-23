import {connect} from 'react-redux';

import {authForgot} from '../../lib/auth/actions';
import ResetPasswordForm from "./ResetPasswordForm";

export default connect(null, {
  authForgot,
})(ResetPasswordForm);
