import { useEffect } from 'react';

const TableWrapper = ({
  Component, setReFetch, reFetch,
}) => {
  useEffect(() => {
    if (reFetch) {
      setReFetch(() => reFetch);
    }
  }, []);

  return Component;
};

export default TableWrapper;
