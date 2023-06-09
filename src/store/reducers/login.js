import { Map } from 'immutable';
import API from '../../api/index';
import {
  REQUEST_LOGIN,
  SET_LOADING,
  SET_ERROR,
  SET_CURRENT_DATA,
  LOGOUT,
  CLEAR_LOGIN,
} from '../actions/login';

const initialState = Map({
  current: null,
  role: null,
  isLoggedIn: false,
  loading: false,
});

const actionsMap = {
  [SET_CURRENT_DATA]: (
    state, { user, token },
  ) => Map(state.withMutations((mutatedState) => mutatedState.set(
    'current', user,
  ).set('token', token))),
  [REQUEST_LOGIN]: (state) => Map(
    state.withMutations(
      (mutatedState) => mutatedState.set('loading', true).set('error', null).set('method', null),
    ),
  ),
  [SET_LOADING]: (
    state, { flag },
  ) => state.set('loading', flag),
  [SET_ERROR]: (state, { error }) => state.set('error', error).set('method', null),
  [LOGOUT]: (state) => {
    API.cancelRequests();
    if (localStorage.getItem('token')) {
      localStorage.removeEncryptedData('token');
      localStorage.removeEncryptedData('refreshToken');
      localStorage.removeEncryptedData('accessTokenExpiration');
    }
    return Map(state.withMutations((mutatedState) => mutatedState.set('loading', false).set('error', null).set('current', null).set('token', null)
      .set('method', 'REQUEST_CANCELLED_SESSION_TIMEOUT')));
  },
  [CLEAR_LOGIN]: (state) => {
    localStorage.removeEncryptedData('token');
    return Map(state.withMutations((mutatedState) => mutatedState.set('loading', false).set('error', null).set('current', null).set('token', null)
      .set('method', null)));
  },
};

export default function login(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
