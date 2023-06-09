import { Map } from 'immutable';
import { ADD_FORM_DATA, CLEAR_FORM_DATA } from '../actions/form';

const initialState = Map({ });

const actionsMap = {
  [ADD_FORM_DATA]: (state, { payload }) => {
    const { fieldsData, name } = payload;
    return state.set(name, { ...state.get(name), ...fieldsData });
  },
  [CLEAR_FORM_DATA]: (state, { name }) => state.delete(name),
};

export default function form(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
