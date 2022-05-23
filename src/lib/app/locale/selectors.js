import {createSelector} from 'reselect';

const getAppLocale = state => state.app.locale.current;

export const getCurrentLocale = createSelector(
  getAppLocale,
  (appLocale) => appLocale
);
