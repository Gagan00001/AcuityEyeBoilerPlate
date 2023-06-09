export const GET_LIST_DATA = '@queryApi/GET_LIST_DATA';
export const SET_LIST_DATA = '@queryApi/SET_LIST_DATA';
export const SET_SORT_ORDER = '@queryApi/SET_SORT_ORDER';
export const SET_FILTERS = '@queryApi/SET_FILTERS';
export const SET_PAGE = '@queryApi/SET_PAGE';
export const SET_LIST_LOADING = '@queryApi/SET_LIST_LOADING';
export const SET_LIST_ERROR = '@queryApi/SET_LIST_ERROR';
export const UPDATE_DATA_WITH_LIST_ID = '@queryApi/UPDATE_DATA_WITH_LIST_ID';

export const getListData = (url, listId, accessor, variables) => ({
  type: GET_LIST_DATA,
  url,
  listId,
  accessor,
  variables,
});

export const setListData = (data, listId, reset,
  hasMore, totalCount, totalPages, otherTableData) => ({
  type: SET_LIST_DATA,
  data,
  listId,
  reset,
  hasMore,
  totalCount,
  totalPages,
  otherTableData,
});

export const setSortOrder = (sortBy, listId) => ({
  type: SET_SORT_ORDER,
  sortBy,
  listId,
});

export const setFilters = (filters, listId) => ({
  type: SET_FILTERS,
  filters,
  listId,
});

export const setPage = (page, listId) => ({
  type: SET_PAGE,
  page,
  listId,
});

export const setListLoading = (loading, listId) => ({
  type: SET_LIST_LOADING,
  loading,
  listId,
});

export const setListError = (error, listId) => ({
  type: SET_LIST_ERROR,
  error,
  listId,
});

export const updateDataWithListId = (url, id, item) => ({
  type: UPDATE_DATA_WITH_LIST_ID,
  url,
  id,
  item,
});
