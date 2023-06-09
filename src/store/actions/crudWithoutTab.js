import {
  requestCreate as requestCreateWithoutTab,
  setCreateData as setCreateDataWithoutTab,
  setCreateError as setCreateErrorWithoutTab,
  setCreateLoading as setCreateLoadingWithoutTab,
  requestDelete as requestDeleteWithoutTab,
  setDeleteData as setDeleteDataWithoutTab,
  setDeleteError as setDeleteErrorWithoutTab,
  setDeleteLoading as setDeleteLoadingWithoutTab,
  requestUpdate as requestUpdateWithoutTab,
  setUpdateData as setUpdateDataWithoutTab,
  setUpdateError as setUpdateErrorWithoutTab,
  setUpdateLoading as setUpdateLoadingWithoutTab,
  clearData as clearDataWithoutTab,
  clearReadData as clearReadDataWithoutTab,
} from './genericAction';

export const REQUEST_CREATE = '@crudWithoutTab/REQUEST_CREATE';
export const REQUEST_UPDATE = '@crudWithoutTab/REQUEST_UPDATE';
export const REQUEST_READ = '@crudWithoutTab/REQUEST_READ';
export const REQUEST_DELETE = '@crudWithoutTab/REQUEST_DELETE';

export const SET_DATA_CREATE = '@crudWithoutTab/SET_DATA_CREATE';
export const SET_DATA_UPDATE = '@crudWithoutTab/SET_DATA_UPDATE';
export const SET_DATA_READ = '@crudWithoutTab/SET_DATA_READ';
export const SET_DATA_DELETE = '@crudWithoutTab/SET_DATA_DELETE';

export const SET_ERROR_CREATE = '@crudWithoutTab/SET_ERROR_CREATE';
export const SET_ERROR_UPDATE = '@crudWithoutTab/SET_ERROR_UPDATE';
export const SET_ERROR_READ = '@crudWithoutTab/SET_ERROR_READ';
export const SET_ERROR_DELETE = '@crudWithoutTab/SET_ERROR_DELETE';

export const SET_LOADING_CREATE = '@crudWithoutTab/SET_LOADING_CREATE';
export const SET_LOADING_UPDATE = '@crudWithoutTab/SET_LOADING_UPDATE';
export const SET_LOADING_READ = '@crudWithoutTab/SET_LOADING_READ';
export const SET_LOADING_DELETE = '@crudWithoutTab/SET_LOADING_DELETE';
export const CLEAR_DATA = '@crudWithoutTab/CLEAR_DATA';
export const CLEAR_READ_DATA = '@crudWithoutTab/CLEAR_READ_DATA';

export const requestRead = (id, url, params) => ({
  type: REQUEST_READ,
  id,
  url,
  params,
});

export const setReadData = (id, data, params) => ({
  type: SET_DATA_READ,
  id,
  data,
  params,
});

export const setReadError = (id, error) => ({
  type: SET_ERROR_READ,
  id,
  error,
});

export const setReadLoading = (id, loading, params) => ({
  type: SET_LOADING_READ,
  id,
  loading,
  params,
});

export const requestCreate = requestCreateWithoutTab(REQUEST_CREATE);

export const setCreateData = setCreateDataWithoutTab(SET_DATA_CREATE);

export const setCreateError = setCreateErrorWithoutTab(SET_ERROR_CREATE);

export const setCreateLoading = setCreateLoadingWithoutTab(SET_LOADING_CREATE);

export const requestDelete = requestDeleteWithoutTab(REQUEST_DELETE);

export const setDeleteData = setDeleteDataWithoutTab(SET_DATA_DELETE);

export const setDeleteError = setDeleteErrorWithoutTab(SET_ERROR_DELETE);

export const setDeleteLoading = setDeleteLoadingWithoutTab(SET_LOADING_DELETE);

export const requestUpdate = requestUpdateWithoutTab(REQUEST_UPDATE);

export const setUpdateData = setUpdateDataWithoutTab(SET_DATA_UPDATE);

export const setUpdateError = setUpdateErrorWithoutTab(SET_ERROR_UPDATE);

export const setUpdateLoading = setUpdateLoadingWithoutTab(SET_LOADING_UPDATE);

export const clearData = clearDataWithoutTab(CLEAR_DATA);

export const clearReadData = clearReadDataWithoutTab(CLEAR_READ_DATA);
