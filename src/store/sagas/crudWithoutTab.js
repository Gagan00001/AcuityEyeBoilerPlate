import {
  put, call, all, select, takeEvery,
} from 'redux-saga/effects';
import { batchActions } from 'redux-batched-actions';
import isEqual from 'lodash/isEqual';
import {
  REQUEST_READ,
  setReadData,
  setReadError,
  setReadLoading,
  REQUEST_CREATE,
  setCreateData,
  setCreateLoading,
  setCreateError,
  setUpdateData,
  setUpdateLoading,
  setUpdateError,
  setDeleteData,
  setDeleteError,
  setDeleteLoading,
  REQUEST_UPDATE,
  REQUEST_DELETE,
} from '../actions/crudWithoutTab';
import {
  createSaga, deleteSaga, logoutHandler, updateSaga,
} from './util';

import customTakeLatest from '../../lib/customTakeLatest';

import api from '../../api';

export const preReadSaga = function* ({
  id, url, params,
}) {
  const { isReFetch } = params || {};
  const sagaParams = params;
  if (!isReFetch) {
    const data = yield select((state) => state.crudWithoutTab.get(id) && state.crudWithoutTab.get(id).get('read'));
    if (data) {
      if (isEqual(params, data.get('params'))) {
        if (data.get('data') || data.get('loading')) { return; }
      }
    }
  }
  delete sagaParams.isReFetch;
  yield put({
    type: 'REQUEST_READ_FETCH',
    id,
    url,
    params: sagaParams,
  });
};

export const readSaga = function* ({
  id, url, params,
}) {
  yield put(setReadLoading(id, true, params));
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
    console.log('<<<<<<<< readSaga >>>>>>>>>>>>>', e, e.message);
    if (e && e.message !== 'REQUEST_CANCELLED_SESSION_TIMEOUT') {
      yield put(batchActions([
        setReadError(id, e),
        logoutHandler(e),
      ]));
    } else {
      yield put(batchActions([
        setReadLoading(id, false),
        logoutHandler(e),
      ]));
    }
  }
};

export default function* root() {
  yield all([
    takeEvery(REQUEST_READ, preReadSaga),
    customTakeLatest('REQUEST_READ_FETCH', readSaga),
    customTakeLatest(REQUEST_CREATE,
      createSaga({ setCreateLoading, setCreateData, setCreateError })),
    customTakeLatest(REQUEST_UPDATE,
      updateSaga({ setUpdateLoading, setUpdateData, setUpdateError })),
    customTakeLatest(REQUEST_DELETE,
      deleteSaga({ setDeleteLoading, setDeleteData, setDeleteError })),
  ]);
}

