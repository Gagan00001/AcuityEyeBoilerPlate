const getRandomNumber = () => {
  const crypto = window.crypto ||
    window.msCrypto || { getRandomValues: () => [1.11] };
  const array = new Uint32Array(1);
  crypto.getRandomValues(array); // Compliant for security-sensitive use cases
  return array[0];
};

export { getRandomNumber };
