import {
  put, call, all, takeEvery, takeLatest,
} from 'redux-saga/effects';
import { batchActions } from 'redux-batched-actions';
import {
  REQUEST_ADD_ENTITY,
  REQUEST_GET_ENTITY,
  REQUEST_UPDATE_ENTITY,
  REQUEST_UPSERT_ENTITY,
  setFormData,
} from '../actions/formHandler';
import api from '../../api/index';
import { logoutHandler } from './util';
import { watchRequests } from '../../lib/customTakeLatest';

const methodRegex = /post|get|put|delete|multipartFormDataServer/;

export const requestAddEntityHandler = function* ({ url, formId, payload }) {
  try {
    yield put(
      setFormData(formId, {
        formId,
        loading: true,
      }),
    );
    let { method = '' } = payload;
    const clonePayload = { ...payload };
    if (!methodRegex.test(method.toLowerCase())) {
      method = 'post';
    } else {
      delete clonePayload.method;
    }
    const response = yield call(api[method.toLowerCase()], {
      url,
      data: clonePayload,
      token: localStorage.getItem('token'),
    });
    yield put(
      setFormData(formId, {
        response,
        formId,
        error: null,
        loading: false,
        clonePayload,
      }),
    );
  } catch (e) {
    yield put(batchActions([logoutHandler(e),
      setFormData(formId, {
        formId,
        error: e,
        loading: false,
      })]));
  }
};
export const requestUpdateEntityHandler = function* ({ url, payload, formId }) {
  yield put(
    setFormData(formId, {
      formId,
      loading: true,
    }),
  );
  let { method } = payload;
  const clonePayload = { ...payload };
  if (!methodRegex.test((method || '').toLowerCase())) method = 'put';
  else delete clonePayload.method;
  try {
    const response = yield call(api[method.toLowerCase()], {
      url,
      data: clonePayload,
      token: localStorage.getItem('token'),
    });
    yield put(
      setFormData(formId, {
        response,
        formId,
        error: null,
        loading: false,
        clonePayload,
      }),
    );
  } catch (e) {
    yield put(batchActions([logoutHandler(e), setFormData(formId, {
      formId,
      error: e,
      loading: false,
      clonePayload,
    })]));
  }
};
export const requestGetEntityHandler = function* ({ url, formId }) {
  yield put(
    setFormData(formId, {
      formId,
      loading: true,
    }),
  );
  try {
    const response = yield call(api.get, {
      url,
      token: localStorage.getItem('token'),
    });
    yield put(
      setFormData(formId, {
        formId,
        error: null,
        loading: false,
        currentFormData: response || {},
      }),
    );
  } catch (e) {
    yield put(batchActions([
      logoutHandler(e),
      setFormData(formId, {
        formId,
        error: e,
        loading: false,
      })]));
  }
};

export const requestUpsertEntityHandler = function* ({
  url, payload, formId, upsertId,
}) {
  yield put(
    setFormData(formId, {
      formId,
      loading: true,
    }),
  );
  let { method } = payload;
  const clonePayload = { ...payload };
  if (!methodRegex.test((method || '').toLowerCase())) method = 'put';
  else delete clonePayload.method;
  try {
    const response = yield call(api[method.toLowerCase()], {
      url,
      data: clonePayload,
      token: localStorage.getItem('token'),
    });
    yield put(
      setFormData(formId, {
        response: { upsertId, ...response },
        formId,
        error: null,
        loading: false,
        clonePayload,
      }),
    );
    return response;
  } catch (e) {
    yield put(batchActions([logoutHandler(e), setFormData(formId, {
      formId,
      error: e,
      loading: false,
      clonePayload,
    })]));
  }
  return false;
};
export default function* root() {
  yield all([
    takeLatest(REQUEST_ADD_ENTITY, requestAddEntityHandler),
    takeEvery(REQUEST_GET_ENTITY, requestGetEntityHandler),
    takeLatest(REQUEST_UPDATE_ENTITY, requestUpdateEntityHandler),
    watchRequests(REQUEST_UPSERT_ENTITY, requestUpsertEntityHandler),
  ]);
}
