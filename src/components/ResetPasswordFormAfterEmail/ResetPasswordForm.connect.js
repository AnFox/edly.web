import {connect} from 'react-redux';

import {authLogin} from '../../lib/auth/actions';
import ResetPasswordForm from "./ResetPasswordForm";

export default connect(null, {
  authLogin,
})(ResetPasswordForm);
