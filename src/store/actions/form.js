export const GET_FORM_DATA = '@form/GET_FORM_DATA';
export const ADD_FORM_DATA = '@form/ADD_FORM_DATA';
export const EDIT_FORM_DATA = '@form/EDIT_FORM_DATA';
export const DELETE_FORM_DATA = '@form/DELETE_FORM_DATA';
export const CLEAR_FORM_DATA = '@form/CLEAR_FORM_DATA';

export const getFormData = (payload) => ({
  type: GET_FORM_DATA,
  payload,
});

export const addFormData = (payload) => ({
  type: ADD_FORM_DATA,
  payload,
});

export const clearFormData = (name) => ({
  type: CLEAR_FORM_DATA,
  name,
});
