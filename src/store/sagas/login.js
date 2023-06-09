import {
  takeLatest, put, call, all,
} from 'redux-saga/effects';
// import { batchActions } from 'redux-batched-actions';

import * as loginAction from '../actions/login';
// import {
//   getEnumData,
// } from '../actions/enum';

import api from '../../api';
import { apiUrls } from '../../api/constants';

export const loginSaga = function* ({
  email: Email, password: Password,
}) {
  const data = {
    Email: Email.toLowerCase(), Password,
  };
  yield put(loginAction.setLoading(true));
  try {
    const result = yield call(api.post, { data, url: apiUrls.LOGIN });
    if (result) {
      localStorage.setItem('token', result.access_token);
    }
    // yield put(batchActions([
    //   getEnumData(result),
    //   loginAction.setCurrentData(result, result.access_token),
    //   loginAction.setError(null),
    // ]));
  } catch (e) {
    yield put(loginAction.setError(e));
  } finally {
    yield put(loginAction.setLoading(false));
  }
};

export const logoutSaga = function* () {
  localStorage.clear();
  yield put(loginAction.clearLoginData());
};

export default function* root() {
  yield all([
    takeLatest(loginAction.REQUEST_LOGIN, loginSaga),
    takeLatest(loginAction.LOGOUT, logoutSaga),
  ]);
}
