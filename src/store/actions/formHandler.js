export const REQUEST_ADD_ENTITY = '@formHandler/REQUEST_ADD_ENTITY';
export const REQUEST_GET_ENTITY = '@formHandler/REQUEST_GET_ENTITY';
export const REQUEST_UPDATE_ENTITY = '@formHandler/REQUEST_UPDATE_ENTITY';
export const REQUEST_UPSERT_ENTITY = '@formHandler/REQUEST_UPSERT_ENTITY';
export const SET_FORM_DATA = '@formHandler/SET_FORM_DATA';
export const CLEAR_FORM_DATA = '@formHandler/CLEAR_FORM_DATA';
export const SET_ERROR = '@formHandler/SET_ERROR';
export const SET_LOADING = '@formHandler/SET_LOADING';

export const requestAddEntity = (url, formId, payload) => ({
  type: REQUEST_ADD_ENTITY,
  url,
  formId,
  payload,

});

export const requestGetEntity = (
  url, formId,
) => ({
  type: REQUEST_GET_ENTITY,
  url,
  formId,
});

export const requestUpdateEntity = (
  url, formId, payload,
) => ({
  type: REQUEST_UPDATE_ENTITY,
  url,
  formId,
  payload,

});

export const requestUpsertEntity = (
  url, formId, idPath, idPayloadKey, switchMethod, upsertId, payload,
) => ({
  type: REQUEST_UPSERT_ENTITY,
  url,
  formId,
  payload,
  idPath,
  switchMethod,
  idPayloadKey,
  upsertId,
});

export const setFormData = (formId, data) => ({
  type: SET_FORM_DATA,
  formId,
  data,
});

export const clearFormData = (formId) => ({
  type: CLEAR_FORM_DATA,
  formId,
});
