import {
  put, call, all,
} from 'redux-saga/effects';

import { batchActions } from 'redux-batched-actions';
import {
  GET_LIST_DATA,
  setListData,
  setListLoading,
  setListError,
  UPDATE_DATA_WITH_LIST_ID,
} from '../actions/queryApi';

import api from '../../api';
import customTakeLatest from '../../lib/customTakeLatest';
import { logoutHandler } from './util';

export const queryListSaga = function* ({
  url, listId, variables, accessor,
}) {
  const {
    page, pageSize, sortBy, filters,
  } = variables;
  let reset = false;
  if (page === 0) {
    reset = true;
    yield put(setListLoading(true, listId));
  }
  try {
    const params = {
      ...sortBy,
      ...filters,
      PageIndex: page,
      PageSize: pageSize,
    };
    const response = yield call(api.get, {
      token: localStorage.getItem('token'),
      url,
      params,
    });
    const parsed = accessor(response);
    const {
      hasNextPage, totalCount, totalPages, result = [], ...otherTableData
    } = parsed;
    yield put(setListData(result, listId, reset, hasNextPage, totalCount,
      totalPages, otherTableData));
  } catch (e) {
    yield put(batchActions([logoutHandler(e),
      setListError(e, listId)]));
  } finally {
    yield put(setListLoading(false, listId));
  }
};

export const updateDataWithListIdSaga = function* ({
  url, id, item,
}) {
  try {
    const data = item;
    const reset = false;
    const response = yield call(api.post, {
      data: data[0],
      url,
      token: localStorage.getItem('token'),
    });
    data[0].id = response.data.documentId;
    yield put(
      setListData({ data }, id, reset),
    );
  } catch (e) {
    yield put(logoutHandler(e));
  }
};

export default function* root() {
  yield all([
    customTakeLatest(GET_LIST_DATA, queryListSaga),
    customTakeLatest(UPDATE_DATA_WITH_LIST_ID, updateDataWithListIdSaga),
  ]);
}
