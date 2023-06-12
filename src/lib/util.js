import compact from 'lodash/compact';

const idCalculator = (...keys) => {
  const keysWithoutUndefined = compact(keys);
  if (!keysWithoutUndefined.length) {
    return false;
  }

  return keysWithoutUndefined.join('_').split(' ').join('_')
    .toLowerCase();
};

const getRandomNumber = () => {
  const crypto = window.crypto ||
    window.msCrypto || { getRandomValues: () => [1.11] };
  const array = new Uint32Array(1);
  crypto.getRandomValues(array); // Compliant for security-sensitive use cases
  return array[0];
};

const getString = (data, joinBy = " ") => {
  const name = [];
  // eslint-disable-next-line no-unused-expressions
  data?.forEach((item) => {
    if (item) {
      name.push(item);
    }
  });
  return name.join(joinBy);
};

const getInitials = (name) => {
  if (Array.isArray(name)) {
    // eslint-disable-next-line no-param-reassign
    name = getString(name);
  }

  const initials = name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

  if (name) {
    return initials.join("").toUpperCase();
  }

  return initials;
};

const toDateValidator = (getFieldValue, fieldName, errorMessage) => ({
  validator(rule, value) {
    if (
      !value ||
      !getFieldValue(fieldName) ||
      getFieldValue(fieldName).isBefore(value, "day") ||
      getFieldValue(fieldName).isSame(value, "day")
    ) {
      return Promise.resolve();
    }
    return Promise.reject(errorMessage);
  },
});

const crudSelector = (state, id, type) => {
  if (!id) {
    return null;
  }
  if (state.crud) {
    if (state.crud.get("currentTab")) {
      return (
        state.crud.get(state.crud.get("currentTab")) &&
        state.crud.get(state.crud.get("currentTab")).get(id) &&
        state.crud.get(state.crud.get("currentTab")).get(id).get(type)
      );
    }
    return state.crud.get(id) && state.crud.get(id).get(type);
  }
  return true;
};

export {
  idCalculator,
  getRandomNumber,
  getString,
  getInitials,
  toDateValidator,
  crudSelector,
};
