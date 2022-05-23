import * as types from './actionTypes';

export function appLocaleSet(payload) {
  return {
    type: types.APP_LOCALE_SET,
    payload
  };
}
