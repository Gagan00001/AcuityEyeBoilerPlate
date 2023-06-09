export const REQUEST_LOGIN = '@login/REQUEST_LOGIN';
export const SET_CURRENT_DATA = '@login/SET_CURRENT_DATA';
export const SET_ERROR = '@login/SET_ERROR';
export const SET_LOADING = '@login/SET_LOADING';
export const LOGOUT = '@login/LOGOUT';
export const CLEAR_LOGIN = '@login/clear';

export const setCurrentData = (user, token) => ({
  type: SET_CURRENT_DATA,
  user,
  token,
});

export const requestLogin = (email, password) => ({
  type: REQUEST_LOGIN,
  email,
  password,
});

export const setError = (error) => ({
  type: SET_ERROR,
  error,
});

export const setLoading = (flag) => ({
  type: SET_LOADING,
  flag,
});

export const clearLoginData = () => ({
  type: CLEAR_LOGIN,
});

export const logout = (method) => ({
  type: LOGOUT,
  method,
});
