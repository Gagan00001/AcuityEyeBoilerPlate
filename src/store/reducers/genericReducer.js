import { fromJS } from 'immutable';

const genericReducer = {
  SET_LOADING: (state, action) => {
    const clonedState = fromJS(state);
    const { flag } = action;
    return clonedState.set('loading', flag);
  },
  SET_ERROR: (state, action) => {
    const clonedState = fromJS(state);
    const { error } = action;
    return clonedState.set('error', error);
  },
  SET_UPDATE: (state, action) => {
    const clonedState = fromJS(state);
    const { flag } = action;
    return clonedState.set('update', flag);
  },
};

export default genericReducer;
