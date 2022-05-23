import React, { Component } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import history from '../../services/HistoryService'
import './App.scss'
import Auth from '../Auth'
import ResetPassword from '../ResetPassword'
import ResetPasswordAfterEmail from '../ResetPasswordAfterEmail'
import SignInRoom from '../SignInRoom'
import SignInSMS from '../SignInSMS'
import Page404 from '../Page_404'
import PageBan from '../PageBan'
import RegSuccess from '../RegistrationSuccess'
import Registration from '../Registration'
import Webinar from '../Webinar'
import RoutePublic from '../../components/RoutePublic'
import RoutePrivate from '../../components/RoutePrivate'
import Rooms from '../Rooms'
import Webinars from '../Webinars'
import RoomSetting from '../RoomSetting'
import WebinarSetting from '../WebinarSetting'
import ProductSetting from '../ProductSetting'
import Privacy from '../Privacy'
import SLA from '../SLA'
import PhoneVerification from '../PhoneVerification'
import Landing from '../Landing'
import Cabinet from '../Cabinet'
import Cashbox from '../Cashbox'
import Product from '../Product'
import CheckPayment from '../CheckPayment'
import Loader from '../../components/Loader'
import RegFormInWebinar from '../../components/RegFormInWebinar'
import RegistrationFinish from '../RegistrationFinish'
import Scenario from '../Scenario'
import ToastMessages from '../../components/ToastMessages'
import Mailings from '../Mailings'
import Polling from '../Polling'
import Training from '../Training'
import EmployeesAI from '../EmployeesAI'
import TunnelsOfSales from '../TunnelsOfSales'
import Constructor from '../Constructor'
import Analytics from '../Analytics'
import Community from '../Community'
import OAuth from '../OAuth'
import TeamForRent from '../TeamForRent'
import AccessDeniedEntryInWebinar from '../../components/GlobalPopUps/AccessDeniedEntryInWebinar'
import OverloadedEntryInWebinar from '../../components/GlobalPopUps/OverloadedEntryInWebinar'
window.Pusher = require('pusher-js')


export default class App extends Component {
  render () {
    const { isLogged, user, alertbarMessages, alertbarDuration, alertbarType } = this.props
    return (
      <div className="App">

        <Loader/>
        <ToastMessages alertBarMessages={alertbarMessages} alertBarDuration={alertbarDuration} alertBarType={alertbarType} />
        <AccessDeniedEntryInWebinar />
        <OverloadedEntryInWebinar />
        <Router history={history}>
          <Switch>
            <Route path="/privacy" component={Privacy}/>
            <Route path="/sla" component={SLA}/>
            <Route path="/webinar/:roomId/:webinarSlug/signup" component={RegFormInWebinar}/>
            <Route path="/webinar/:roomId/signup" component={RegFormInWebinar}/>
            <RoutePublic path="/landing" component={Landing} isAuthenticated={isLogged}/>
            <RoutePublic path="/login" component={Auth} isAuthenticated={isLogged}/>
            <RoutePublic path="/oauth/:network/:type" component={OAuth} isAuthenticated={isLogged} />
            <RoutePublic exact path="/register" component={Registration} isAuthenticated={false}/>
            <RoutePrivate path="/register/finish" component={RegistrationFinish} isAuthenticated={isLogged} user={user}/>
            <RoutePublic path="/resetpass" component={ResetPassword} isAuthenticated={false}/>
            <RoutePublic path="/resetpassafteremail" component={ResetPasswordAfterEmail} isAuthenticated={false}/>
            <RoutePublic path="/signinroom" component={SignInRoom} isAuthenticated={false}/>
            <RoutePublic path="/404" component={Page404} isAuthenticated={false}/>
            <RoutePublic path="/regsuccess" component={RegSuccess} isAuthenticated={false}/>
            <RoutePublic path="/signinsms" component={SignInSMS} isAuthenticated={false}/>
            <RoutePublic path="/product/:productId?" component={Product} isAuthenticated={false}/>
            <RoutePrivate path="/verifyphone" component={PhoneVerification} isAuthenticated={isLogged} user={user}/>
            {!user.owner && <RoutePrivate path="/webinars" component={Webinars} isAuthenticated={isLogged} user={user}/>}
            <RoutePrivate exact path="/rooms" component={Rooms} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/rooms/:roomsId?" component={Webinars} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/scenario/:roomId" component={Scenario} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/ban" component={PageBan} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/cabinet" component={Cabinet} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/cashbox" component={Cashbox} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/checkpayment" component={CheckPayment} isAuthenticated={isLogged} user={user}/>

            <RoutePrivate path="/mailings" component={Mailings} isAuthenticated={isLogged} user={user} />
            <RoutePrivate path="/polling" component={Polling} isAuthenticated={isLogged} user={user} />
            <RoutePrivate path="/training" component={Training} isAuthenticated={isLogged} user={user} />
            <RoutePrivate path="/employeesAI" component={EmployeesAI} isAuthenticated={isLogged} user={user} />
            <RoutePrivate path="/tunnelsOfSales" component={TunnelsOfSales} isAuthenticated={isLogged} user={user} />
            <RoutePrivate path="/constructor" component={Constructor} isAuthenticated={isLogged} user={user} />
            <RoutePrivate path="/analytics" component={Analytics} isAuthenticated={isLogged} user={user} />
            <RoutePrivate path="/community" component={Community} isAuthenticated={isLogged} user={user} />
            <RoutePrivate path="/teamForRent" component={TeamForRent} isAuthenticated={isLogged} user={user} />

            <RoutePrivate path="/edit/product/:productId?" component={ProductSetting} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/edit/room/:roomId?" component={RoomSetting} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/edit/webinar/:webinarId?" component={WebinarSetting} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate exact path="/webinar/:roomId?" redirectRoute={`${history.location.pathname}/signup`} component={Webinar} isAuthenticated={isLogged} user={user}/>
            <RoutePrivate path="/webinar/:roomId/:webinarSlug?" redirectRoute={`${history.location.pathname}/signup`} component={Webinar} isAuthenticated={isLogged} user={user}/>
            {!isLogged && <Redirect to="/landing"/>}
            {user.owner ? <Redirect to="/rooms"/> : <Redirect to="/webinars"/>}
          </Switch>
        </Router>
      </div>
    )
  }
}

App.propTypes = {
  user: PropTypes.any,
  getUser: PropTypes.func.isRequired,
  isLogged: PropTypes.bool.isRequired,
  alertbarDuration: PropTypes.number,
  alertbarMessages: PropTypes.array.isRequired,
  alertbarType: PropTypes.string.isRequired,
  alertbarHide: PropTypes.func.isRequired
}
