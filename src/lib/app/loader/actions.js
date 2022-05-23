import * as types from './actionTypes';

export function loaderShow() {
  return {
    type: types.APP_LOADER_SHOW,
  };
}

export function loaderHide() {
  return {
    type: types.APP_LOADER_HIDE,
  };
}
