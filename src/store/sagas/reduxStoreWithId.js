import {
  put, call, all,
} from 'redux-saga/effects';
import { batchActions } from 'redux-batched-actions';
import {
  REQUEST_READ,
  setReadData,
  setReadError,
  setReadLoading,
} from '../actions/reduxStoreWithId';
import { logoutHandler } from './util';

import customTakeLatest from '../../lib/customTakeLatest';

import api from '../../api';

export const readSaga = function* ({
  id, url, params,
}) {
  yield put(setReadLoading(id, true));
  try {
    const response = yield call(api.get, {
      token: localStorage.getItem('token'),
      url,
      params,
    });
    yield put(
      setReadData(id, response),
    );
  } catch (e) {
    console.warn('<<<<<<<< readSaga >>>>>>>>>>>>>', e, e.message);
    if (e && e.message !== 'REQUEST_CANCELLED_SESSION_TIMEOUT') {
      yield put(batchActions([
        setReadError(id, e),
        logoutHandler(e),
      ]));
    } else {
      yield put(
        logoutHandler(e),
      );
    }
  } finally {
    yield put(setReadLoading(id, false));
  }
};

export default function* root() {
  yield all([
    customTakeLatest(REQUEST_READ, readSaga),
  ]);
}

