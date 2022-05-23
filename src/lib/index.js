import {combineReducers} from 'redux';

import app from './app';
import navigation from './navigation';
import admin from './admin';
import auth from "./auth/reducer";

export default combineReducers({
  app,
  navigation,
  auth,
  admin,
});
