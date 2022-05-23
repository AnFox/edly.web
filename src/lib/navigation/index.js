import {combineReducers} from 'redux';
import intendedUrl from "../navigation/reducer";

const appReducer = combineReducers({
  intendedUrl
});

export const defaultRoute = '/rooms';

export default appReducer;
