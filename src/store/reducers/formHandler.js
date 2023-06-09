import {
  Map,
} from 'immutable';
import get from 'lodash/get';
import {
  SET_FORM_DATA,
  CLEAR_FORM_DATA,
} from '../actions/formHandler';

const initialState = Map({ });

const actionsMap = {
  [SET_FORM_DATA]: (state, action) => state.set(action.formId, {
    response: get(action, 'data.response'),
    error: get(action, 'data.error'),
    loading: get(action, 'data.loading'),
    payload: get(action, 'data.payload'),
    currentFormData: get(action, 'data.currentFormData'),
  }),
  [CLEAR_FORM_DATA]: (state, action) => state.set(action.formId, {}),
};

export default function formHandler(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
