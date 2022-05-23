import {DEFAULT_LOCALE} from '../../../config';

import * as types from './actionTypes';
import {LOG_OUT} from "../../auth/actionTypes";

const initialState = {
  current: DEFAULT_LOCALE,
};

const locale = (state = initialState, {type, payload}) => {
  switch (type) {
    case LOG_OUT:
      return {
        ...initialState,
      };
    case types.APP_LOCALE_SET:
      return {
        ...state,
        current: payload,
      };

    default:
      return state;
  }
};

export default locale;
