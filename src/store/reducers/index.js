import { combineReducers } from 'redux';
import { Map } from 'immutable';
import login from './login';
import queryApi from './queryApi';
import form from './form';
import formHandler from './formHandler';
import crud from './crud';
import crudWithoutTab from './crudWithoutTab';
import reduxStoreWithId from './reduxStoreWithId';

function getTabState(state, requestedCurrentTabName) {
  const currentTab = requestedCurrentTabName || state.get('currentTab');
  if (currentTab) {
    return state.get(currentTab) || Map({});
  }
  return state;
}

function updateTabState(state, tabNewState, requestedCurrentTabName) {
  if (!state) {
    return tabNewState;
  }
  const currentTab = requestedCurrentTabName || state.get('currentTab');
  return currentTab ? state.set(currentTab, tabNewState) : tabNewState;
}

function tabWrapper(reducer) {
  return (state, action) => {
    if (action.type === 'CLEAR_TAB_DATA') {
      return state.delete(action.tabId);
    }
    if (action.type === 'CLEAR_CURRENT_TAB') {
      return state.delete('currentTab');
    }
    if (action.type === 'SET_CURRENT_TAB') {
      return state.set('currentTab', action.currentTab);
    }
    const tabState = state ? getTabState(state, action?.currentTab) : state;
    const tabNewState = reducer ? reducer(tabState, action) : tabState;
    return updateTabState(state, tabNewState, action?.currentTab);
  };
}

const appReducer = combineReducers({
  login,
  queryApi,
  form: tabWrapper(form),
  formHandler,
  crud: tabWrapper(crud),
  crudWithoutTab,
  reduxStoreWithId: tabWrapper(reduxStoreWithId),
});

export default (state, action) => {
  if (action.type === '@login/LOGOUT') {
    // eslint-disable-next-line no-param-reassign
    state = { login: state.login };
  }
  return appReducer(state, action);
};
