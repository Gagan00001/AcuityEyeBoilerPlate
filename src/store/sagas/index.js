import { fork, all } from 'redux-saga/effects';
import login from './login';
import queryApi from './queryApi';
import fromHandler from './formHandler';
import crud from './crud';
import crudWithoutTab from './crudWithoutTab';
import reduxStoreWithId from './reduxStoreWithId';

export default function* root() {
  yield all([
    fork(login),
    fork(queryApi),
    fork(fromHandler),
    fork(crud),
    fork(crudWithoutTab),
    fork(reduxStoreWithId),
  ]);
}
