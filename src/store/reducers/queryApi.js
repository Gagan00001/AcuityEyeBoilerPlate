import { Map } from 'immutable';

import {
  GET_LIST_DATA,
  SET_LIST_DATA,
  SET_LIST_LOADING,
  SET_LIST_ERROR,
  SET_SORT_ORDER,
  SET_FILTERS,
  SET_PAGE,
} from '../actions/queryApi';

const initialState = Map({
});

const actionsMap = {

  [GET_LIST_DATA]: (state, { listId }) => {
    const list = state.get(listId, {});
    return state.set(listId, {
      ...list, error: null, data: list.data || [],
    });
  },

  [SET_LIST_DATA]: (state, {
    data = [], listId, reset, hasMore, totalCount, totalPages, otherTableData,
  }) => {
    const list = state.get(listId, {});
    if (reset) {
      return state.set(listId, {
        ...list,
        data,
        hasMore,
        totalCount,
        totalPages,
        otherTableData: otherTableData || {},
      });
    }
    const prevData = list.data || [];
    return state.set(listId, {
      ...list,
      hasMore,
      totalCount,
      totalPages,
      data: [...prevData, ...data],
      otherTableData: otherTableData || {},
    });
  },

  [SET_SORT_ORDER]: (state, { sortBy, listId }) => {
    const list = state.get(listId);
    return state.set(listId, { ...list, sortBy });
  },

  [SET_FILTERS]: (state, { filters, listId }) => {
    const list = state.get(listId);
    return state.set(listId, { ...list, filters });
  },

  [SET_PAGE]: (state, { page, listId }) => {
    const list = state.get(listId);
    return state.set(listId, { ...list, page });
  },

  [SET_LIST_LOADING]: (state, { loading, listId }) => {
    const list = state.get(listId);
    return state.set(listId, { ...list, loading });
  },

  [SET_LIST_ERROR]: (state, { error, listId }) => {
    const list = state.get(listId);
    return state.set(listId, { ...list, error });
  },
};

export default function queryApi(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
