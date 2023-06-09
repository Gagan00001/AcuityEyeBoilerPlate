import set from 'lodash/set';
import get from 'lodash/get';
import {
  cancel, fork, take, call, actionChannel,
} from 'redux-saga/effects';

const customTakeLatest = (pattern, saga, ...args) => fork(function* () {
  const lastTask = {};
  while (true) {
    const action = yield take(pattern);
    const id = action?.params?.takeLatestId || action.listId || action.id || action.url;
    if (lastTask[id]) {
      yield cancel(lastTask[id]); // cancel is no-op if the task has already terminated
    }
    lastTask[id] = yield fork(saga, ...args.concat(action));
  }
});

export const watchRequests = (pattern, saga, ...args) => fork(function* () {
  const lastCallResponseIdInfo = {};
  const requestChan = yield actionChannel(pattern);
  while (true) {
    const action = yield take(requestChan);
    const {
      idPath, upsertId, idPayloadKey, switchMethod, formId,
    } = action;
    if (get(lastCallResponseIdInfo, `${formId + upsertId}.id`) && idPayloadKey) {
      if (idPayloadKey === 'URL') {
        action.url = `${action.url}/${get(lastCallResponseIdInfo, `${formId + upsertId}.id`)}`;
      } else {
        set(action, idPayloadKey, get(lastCallResponseIdInfo, `${formId + upsertId}.id`));
      }

      if (switchMethod) {
        set(action, 'payload.method', 'put');
      }
    }
    const response = yield call(saga, ...args.concat(action));
    if (get(response, idPath)) {
      lastCallResponseIdInfo[formId + upsertId] = { id: get(response, idPath) };
    }
  }
});

export default customTakeLatest;
