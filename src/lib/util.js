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

export { getRandomNumber, getString, getInitials };
