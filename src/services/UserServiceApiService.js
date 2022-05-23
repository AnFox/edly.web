import {Api} from 'illion-api';
import ApiTokensStorage from '../services/ApiTokensStorage';
import reduxStore from '../services/StoreService';

import {loaderHide, loaderShow} from '../lib/app/loader/actions';
import {USS_API_ENDPOINT} from "../config";
import {alertbarShow} from "../lib/app/alertbar/actions";
import UserServiceApiResources from "./UserServiceApiResources";

const store = reduxStore.get();

class UserServiceApiService extends UserServiceApiResources {
  constructor() {
    super();

    this.tokenStorage = new ApiTokensStorage();
    this.api = new Api(
      {
        baseURL: USS_API_ENDPOINT,
        timeout: 300 * 1000,
      },
      {
        onAccessTokenExpired: () => {
          this.tokenStorage.clearTokens();
        },
        onRequestStart: () => this.loaderShow(),
        onRequestFinish: () => this.loaderHide(),
        extractResponsePayloadData: response => response.data.data,
        authEndpoints: {
          login: 'auth/login',
          register: 'auth/register',
          refresh: 'auth/refresh',
          logout: 'auth/logout',
        },
        publicEndpoints: [
        ]
      },
      this.tokenStorage
    );

    this.api.getAxiosInstance().interceptors.request.use((config) => {
      this.setLocaleHeader(config);

      return config;
    }, error => {
      Promise.reject(error)
    });

    this.api.getAxiosInstance().interceptors.response.use(
      response => response,
      (error) => {
        const {response, config} = error;

        if (!config || (config && !config.silentError)) {
          this.handleError(error);
        }

        if (response && response.data) {
          const {message} = response.data;

          if (message === 'blocked') {
            this.tokenStorage.clearTokens(); // токен заблочен на сервере, удаляем его.
          }
        }

        return Promise.reject(error);
      }
    );
  }

  getCurrentToken() {
    return this.tokenStorage.getTokens();
  }

  updateToken(data) {
    this.api.setTokens(data);
  }

  loaderShow() {
    store.dispatch(loaderShow());
  }

  loaderHide() {
    store.dispatch(loaderHide());
  }

  setLocaleHeader(config) {
    const tokens = this.getCurrentToken();

    if (!tokens.access_token) {
      config.headers['Accept-Language'] = store.getState().app.locale.current; // eslint-disable-line no-param-reassign
    }
  }

  handleError(e) {
    const error = e.response && e.response.data ? e.response.data : e;
    const messages = this.getErrorMessages(error);
    // console.error('Error: ', message);
    // sentry.setFingerprints([message]);

    store.dispatch(alertbarShow({
      type: 'error',
      messages,
    }));
  }

  getErrorMessages(error) {
    if (error.errors) {
      return Object.values(error.errors).reduce((mem, e) => [...mem, ...e], []).map(e => (
        typeof e === 'string' ? e : e.message || ''
      ));
    }
    if (error.data && error.data.errors) {
      return Object.values(error.data.errors).reduce((mem, e) => [...mem, ...e], []).map(e => (
        typeof e === 'string' ? e : e.message || ''
      ));
    }

    if (error.message) return [error.message];

    return 'Server error';
  }
}

const userServiceApi = new UserServiceApiService();

export default userServiceApi;
