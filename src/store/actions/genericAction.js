export const SET_CURRENT_TAB = 'SET_CURRENT_TAB';

export const setCurrentTab = (currentTab) => ({
  type: SET_CURRENT_TAB,
  currentTab,
});

export const requestCreate = (type) => (id, url, params, cacheResponse) => ({
  type,
  id,
  url,
  params,
  cacheResponse,
});

export const setCreateData = (type) => (id, data, currentTab) => ({
  type,
  id,
  data,
  currentTab,
});

export const setCreateError = (type) => (id, error, currentTab) => ({
  type,
  id,
  error,
  currentTab,
});

export const setCreateLoading = (type) => (id, loading, currentTab) => ({
  type,
  id,
  loading,
  currentTab,
});

export const requestDelete = (type) => (id, url, params) => ({
  type,
  id,
  url,
  params,
});

export const setDeleteData = setCreateData;

export const setDeleteError = setCreateError;

export const setDeleteLoading = setCreateLoading;

export const requestUpdate = requestCreate;

export const setUpdateData = setCreateData;

export const setUpdateError = setCreateError;

export const setUpdateLoading = setCreateLoading;

export const clearData = (type) => (id) => ({
  type,
  id,
});

export const clearReadData = clearData;
