import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  requestRead, requestCreate, requestUpdate, requestUpdateAll,
  clearData, requestDelete, clearReadData, requestCreateWithDebounce,
} from '../store/actions/crud';

import Notification from '../components/Notification';

import { crudSelector } from '../lib/util';

async function fetchErrorFromBlob(data) {
  const res = JSON.parse(await data?.text() || '');
  return res?.Errors?.[0];
}

export default function useCRUD({
  id: initialId, url, type, shouldClearError = true,
}) {
  const dispatch = useDispatch();
  const [modifiedId, setId] = useState();
  const id = modifiedId || initialId;
  const response = useSelector((state) => crudSelector(state, id, type === 'createWithDebounce' ? 'create' : type));
  const { message } = response?.get('error') || {};
  const op = {};
  /* Function to make read request to server for type READ */
  op.read = useCallback((params = {}, extraURL = '', newId = '') => {
    if (newId) setId(newId);
    dispatch(requestRead(newId || id, `${url}${extraURL}`, params));
  }, [id, url, dispatch]);
  /* ******************* */
  /* Function to make read request to server for type CREATE */
  op.create = useCallback((params = {}, extraURL = '', newId = '', cacheResponse = false) => {
    if (newId) setId(newId);
    dispatch(requestCreate(newId || id, `${url}${extraURL}`, params, cacheResponse));
  }, [id, url, dispatch]);
  /* ******************* */
  /* Function to make read request to server for type UPDATE */
  op.update = useCallback((params = {}, extraURL = '', newId = '', cacheResponse = false) => {
    if (newId) setId(newId);
    dispatch(requestUpdate(newId || id, `${url}${extraURL}`, params, cacheResponse));
  }, [id, url, dispatch]); /* ******************* */
  /* Function to make read request to server for type UPDATE */
  op.updateAll = useCallback((params = {}, extraURL = '', newId = '', cacheResponse = false) => {
    if (newId) setId(newId);
    dispatch(requestUpdateAll(newId || id, `${url}${extraURL}`, params, cacheResponse));
  }, [id, url, dispatch]);
  /* ******************* */
  /* Function to make read request to server for type DELETE */
  op.delete = useCallback((params = {}, extraURL = '', newId = '') => {
    if (newId) setId(newId);
    dispatch(requestDelete(newId || id, `${url}${extraURL}`, params));
  }, [id, url, dispatch]);
  /* ******************* */
  /* Function to make read request to server for type CREATE WITH DEBOUNCE */
  op.createWithDebounce = useCallback((params = {}, extraURL = '', newId = '', cacheResponse = false) => {
    if (newId) setId(newId);
    dispatch(requestCreateWithDebounce(newId || id, `${url}${extraURL}`, params, cacheResponse));
  }, [id, url, dispatch]);
  /* ******************* */

  const clear = useCallback((read) => {
    dispatch(clearData(id));
    if (read) dispatch(clearReadData(id));
  }, [dispatch, id]);

  useEffect(() => {
    let isError = true;
    const errorMessage = response?.get('error')?.response?.data?.Errors?.[0] || message;
    if (response?.get('error')?.response?.data?.type === 'application/json') {
      (async () => {
        const error = await fetchErrorFromBlob(response?.get('error')?.response?.data);
        Notification({ message: error });
      })();
      clear(type === 'read');
      isError = false;
    }
    if (shouldClearError && (errorMessage) && isError) {
      Notification({ message: errorMessage });
      clear(type === 'read');
    }
  }, [message, response]);

  return [response?.get('data'), response?.get('error')?.response?.data?.Errors?.[0] || message, !!response?.get('loading'), op[type], clear];
}
