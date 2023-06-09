import {
  requestCreate as requestCreateFunc,
  setCreateData as setCreateDataFunc,
  setCreateError as setCreateErrorFunc,
  setCreateLoading as setCreateLoadingFunc,
  requestDelete as requestDeleteFunc,
  setDeleteData as setDeleteDataFunc,
  setDeleteError as setDeleteErrorFunc,
  setDeleteLoading as setDeleteLoadingFunc,
  requestUpdate as requestUpdateFunc,
  setUpdateData as setUpdateDataFunc,
  setUpdateError as setUpdateErrorFunc,
  setUpdateLoading as setUpdateLoadingFunc,
  clearData as clearDataFunc,
  clearReadData as clearReadDataFunc,
} from './genericAction';

export const REQUEST_CREATE = '@crud/REQUEST_CREATE';
export const REQUEST_UPDATE = '@crud/REQUEST_UPDATE';
export const REQUEST_UPDATE_ALL = '@crud/REQUEST_UPDATE_ALL';
export const REQUEST_READ = '@crud/REQUEST_READ';
export const REQUEST_DELETE = '@crud/REQUEST_DELETE';
export const REQUEST_CREATE_WITH_DEBOUNCE = '@crud/REQUEST_CREATE_WITH_DEBOUNCE';

export const SET_DATA_CREATE = '@crud/SET_DATA_CREATE';
export const SET_DATA_UPDATE = '@crud/SET_DATA_UPDATE';
export const SET_DATA_UPDATE_ALL = '@crud/SET_DATA_UPDATE_ALL';
export const SET_DATA_READ = '@crud/SET_DATA_READ';
export const SET_DATA_DELETE = '@crud/SET_DATA_DELETE';

export const SET_ERROR_CREATE = '@crud/SET_ERROR_CREATE';
export const SET_ERROR_UPDATE = '@crud/SET_ERROR_UPDATE';
export const SET_ERROR_UPDATE_ALL = '@crud/SET_ERROR_UPDATE_ALL';
export const SET_ERROR_READ = '@crud/SET_ERROR_READ';
export const SET_ERROR_DELETE = '@crud/SET_ERROR_DELETE';

export const SET_LOADING_CREATE = '@crud/SET_LOADING_CREATE';
export const SET_LOADING_UPDATE = '@crud/SET_LOADING_UPDATE';
export const SET_LOADING_UPDATE_ALL = '@crud/SET_LOADING_UPDATE_ALL';
export const SET_LOADING_READ = '@crud/SET_LOADING_READ';
export const SET_LOADING_DELETE = '@crud/SET_LOADING_DELETE';
export const CLEAR_DATA = '@crud/CLEAR_DATA';
export const CLEAR_READ_DATA = '@crud/CLEAR_READ_DATA';

export const requestRead = (id, url, params) => ({
  type: REQUEST_READ,
  id,
  url,
  params,
});

export const setReadData = (id, data, currentTab) => ({
  type: SET_DATA_READ,
  id,
  data,
  currentTab,
});

export const setReadError = (id, error, currentTab) => ({
  type: SET_ERROR_READ,
  id,
  error,
  currentTab,
});

export const setReadLoading = (id, loading, currentTab) => ({
  type: SET_LOADING_READ,
  id,
  loading,
  currentTab,
});

export const requestUpdateAll = (id, url, params, cacheResponse) => ({
  type: REQUEST_UPDATE_ALL,
  id,
  url,
  params,
  cacheResponse,
});

export const setUpdateDataAll = (id, data) => ({
  type: SET_DATA_UPDATE_ALL,
  id,
  data,
});

export const setUpdateLoadingAll = (id, loading) => ({
  type: SET_LOADING_UPDATE_ALL,
  id,
  loading,
});

export const setUpdateErrorAll = (id, error) => ({
  type: SET_ERROR_UPDATE_ALL,
  id,
  error,
});

export const requestCreate = requestCreateFunc(REQUEST_CREATE);

export const setCreateData = setCreateDataFunc(SET_DATA_CREATE);

export const setCreateError = setCreateErrorFunc(SET_ERROR_CREATE);

export const setCreateLoading = setCreateLoadingFunc(SET_LOADING_CREATE);

export const requestDelete = requestDeleteFunc(REQUEST_DELETE);

export const setDeleteData = setDeleteDataFunc(SET_DATA_DELETE);

export const setDeleteError = setDeleteErrorFunc(SET_ERROR_DELETE);

export const setDeleteLoading = setDeleteLoadingFunc(SET_LOADING_DELETE);

export const requestUpdate = requestUpdateFunc(REQUEST_UPDATE);

export const requestCreateWithDebounce = requestCreateFunc(REQUEST_CREATE_WITH_DEBOUNCE);

export const setUpdateData = setUpdateDataFunc(SET_DATA_UPDATE);

export const setUpdateError = setUpdateErrorFunc(SET_ERROR_UPDATE);

export const setUpdateLoading = setUpdateLoadingFunc(SET_LOADING_UPDATE);

export const clearData = clearDataFunc(CLEAR_DATA);

export const clearReadData = clearReadDataFunc(CLEAR_READ_DATA);
