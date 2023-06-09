import { isImmutable } from 'immutable';

// Login
export const getCurrentUser = (state) => state.login.get('current');
export const isLoading = (state) => state.login.get('loading');


export const getTableDataById = (state, id) => (state.queryApi.get(id) && isImmutable(state.queryApi.get(id)) ? state.queryApi.get(id).get('data') : state.queryApi.get(id));
export const getCrudDataById = (state, id, tabId) => {
  if (state.crud.get(tabId)) {
    if (state.crud.get(tabId).get(id) && isImmutable(state.crud.get(tabId).get(id))) {
      return state.crud?.get(tabId)?.get(id)?.get('read')?.get('data');
    }
    return state.crud?.get(tabId)?.get(id);
  }
  return [];
};
export const getTableLoading = (state) => state.queryApi.get('loading');
export const getTableError = (state) => state.queryApi.get('error');

