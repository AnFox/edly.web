import { connect } from 'react-redux'
import App from './App'
import { alertbarHide } from '../../lib/app/alertbar/actions'
import { getUser } from '../../lib/app/user/actions'

function mapStateToProps (state) {
  return {
    isLogged: Boolean(state.auth.tokens),
    alertbarDuration: state.app.alertbar.duration,
    alertbarMessages: state.app.alertbar.messages,
    alertbarType: state.app.alertbar.type,
    user: state.app.user
  }
}

export default connect(mapStateToProps, {
  alertbarHide,
  getUser
})(App)
