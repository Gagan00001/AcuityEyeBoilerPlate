
import { call, put, select } from 'redux-saga/effects';
import { batchActions } from 'redux-batched-actions';
import { logout } from '../actions/login';
import api from '../../api';

const mergeUpdatedData = (state, form, key) => {
  const currentTabData = form.get(form.get('currentTab')).toJS();
  const lastFormSavedData = currentTabData[key];
  return { ...state, ...lastFormSavedData };
};

const logoutHandler = (error) => {
  const { status } = error.response || {};
  if (status === 401) {
    if (!process.env.TEST_ENV) {
      return logout('REQUEST_CANCELLED_SESSION_TIMEOUT');
    }
  }
  return { type: null };
};

const createSaga = ({ setCreateLoading, setCreateData, setCreateError }) => function* ({
  id, url, params, cacheResponse,
}) {
  const currentTab = yield select((state) => state.crud?.get('currentTab'));
  try {
    yield put(setCreateLoading(id, true, currentTab));
    const response = yield call(api.post, {
      url,
      data: params.data,
      token: localStorage.getItem('token'),
    });
    if (!cacheResponse) {
      yield put(
        setCreateData(id, response, currentTab),
      );
    }
  } catch (e) {
    yield put(logoutHandler(e));
    if (!cacheResponse) {
      yield put(setCreateError(id, e, currentTab));
    }
  } finally {
    yield put(setCreateLoading(id, false, currentTab));
  }
};

const deleteSaga = ({ setDeleteLoading, setDeleteData, setDeleteError }) => function* ({
  id,
  url, params,
}) {
  const currentTab = yield select((state) => state.crud?.get('currentTab'));
  try {
    yield put(setDeleteLoading(id, true, currentTab));
    const response = yield call(api.delete, {
      url,
      data: params,
      token: localStorage.getItem('token'),
    });
    yield put(
      setDeleteData(id, response, currentTab),
    );
  } catch (e) {
    yield put(batchActions([
      logoutHandler(e),
      setDeleteError(id, e, currentTab),
    ]));
  } finally {
    yield put(setDeleteLoading(id, false, currentTab));
  }
};

const updateSaga = ({ setUpdateLoading, setUpdateData, setUpdateError }) => function* ({
  id, url, params, cacheResponse,
}) {
  const currentTab = yield select((state) => state.crud?.get('currentTab'));
  try {
    yield put(setUpdateLoading(id, true, currentTab));
    const response = yield call(api.put, {
      url,
      data: params,
      token: localStorage.getItem('token'),
    });
    if (!cacheResponse) {
      yield put(
        setUpdateData(id, response || { success: true }, currentTab),
      );
    }
  } catch (e) {
    yield put(logoutHandler(e));
    if (!cacheResponse) {
      yield put(setUpdateError(id, e, currentTab));
    }
  } finally {
    yield put(setUpdateLoading(id, false, currentTab));
  }
};

export {
  mergeUpdatedData,
  logoutHandler,
  createSaga,
  deleteSaga,
  updateSaga,
};
