import {connect} from 'react-redux';

import {authLogin} from '../../lib/auth/actions';
import SignInRoom from "./SignInRoom";

export default connect(null, {
  authLogin,
})(SignInRoom);
