import {
  put, call, all, delay, select,
} from 'redux-saga/effects';
import { batchActions } from 'redux-batched-actions';
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
  REQUEST_UPDATE_ALL,
  setUpdateLoadingAll,
  setUpdateDataAll,
  setUpdateErrorAll,
  REQUEST_CREATE_WITH_DEBOUNCE,
} from '../actions/crud';
import {
  createSaga, deleteSaga, logoutHandler, updateSaga,
} from './util';

import customTakeLatest from '../../lib/customTakeLatest';

import api from '../../api';

export const readSaga = function* ({
  id, url, params,
}) {
  const currentTab = yield select((state) => state.crud?.get('currentTab'));
  yield put(setReadLoading(id, true, currentTab));
  try {
    const response = yield call(api.get, {
      token: localStorage.getItem('token'),
      url,
      params,
    });
    yield put(
      setReadData(id, response, currentTab),
    );
  } catch (e) {
    console.log('<<<<<<<< readSaga >>>>>>>>>>>>>', e, e.message);
    if (e && e.message !== 'REQUEST_CANCELLED_SESSION_TIMEOUT') {
      yield put(batchActions([
        setReadError(id, e, currentTab),
        logoutHandler(e),
      ]));
    } else {
      yield put(batchActions([
        setReadLoading(id, false, currentTab),
        logoutHandler(e),
      ]));
    }
  }
};

export const updateAllSaga = function* ({
  id, url, params, cacheResponse,
}) {
  try {
    if (!Array.isArray(params)) {
      throw new Error('Update params type should be array type.');
    }
    yield put(setUpdateLoadingAll(id, true));
    const promiseAll = {};
    params.forEach((update, index) => {
      promiseAll[index] = call(api.put, {
        url: url + (update?.urlParams || ''),
        data: update.data,
        token: localStorage.getItem('token'),
      });
    });
    const response = yield all(promiseAll);
    if (!cacheResponse) {
      yield put(
        setUpdateDataAll(id, response),
      );
    }
  } catch (e) {
    yield put(logoutHandler(e));
    if (!cacheResponse) {
      yield put(setUpdateErrorAll(id, e));
    }
  } finally {
    yield put(setUpdateLoadingAll(id, false));
  }
};

const debounceCreateSaga = function* (params) {
  yield delay(params?.params?.debounceTime || 2000); // <= here you debounce <input/> typing
  yield createSaga({ setCreateLoading, setCreateData, setCreateError })(params);
};

export default function* root() {
  yield all([
    customTakeLatest(REQUEST_READ, readSaga),
    customTakeLatest(REQUEST_CREATE,
      createSaga({ setCreateLoading, setCreateData, setCreateError })),
    customTakeLatest(REQUEST_UPDATE,
      updateSaga({ setUpdateLoading, setUpdateData, setUpdateError })),
    customTakeLatest(REQUEST_DELETE,
      deleteSaga({ setDeleteLoading, setDeleteData, setDeleteError })),
    customTakeLatest(REQUEST_UPDATE_ALL, updateAllSaga),
    customTakeLatest(REQUEST_CREATE_WITH_DEBOUNCE, debounceCreateSaga),
  ]);
}
