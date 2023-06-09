import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isPlainObject from 'lodash/isPlainObject';

const FilterManager = ({
  children, initialFilters, onChange, commaSeperated, filtersToInclude, filtersOnClear,
}) => {
  const [filters, setFilters] = React.useState(() => initialFilters);
  const handleOnChange = useMemo(() => debounce(onChange || (() => null), 1000), [onChange]);
  const handleFilters = useCallback((e, reset = false, isCheckbox = false) => {
    let updatedFilters = {};
    if (reset) {
      updatedFilters = e;
    } else if (isCheckbox) {
      const { name, checked } = e.target;
      updatedFilters = {
        ...filters,
        [name]: checked,
      };
    } else if (e?.target) {
      const { name, value } = e.target;
      updatedFilters = {
        ...filters,
        [name]: value,
      };
    } else if (isPlainObject(e)) {
      updatedFilters = {
        ...filters,
        ...e,
      };
    }
    setFilters(updatedFilters);
    if (commaSeperated) {
      let newFilters = Object.keys(updatedFilters).filter((key) => {
        if (updatedFilters[key] && filtersToInclude.includes(key)) {
          return key;
        }
        return null;
      }).join();
      newFilters = newFilters?.length ? newFilters : filtersOnClear;
      handleOnChange({
        ...updatedFilters,
        Status: newFilters,
      });
    } else {
      handleOnChange(updatedFilters);
    }
  }, [commaSeperated, filters, filtersOnClear, handleOnChange, filtersToInclude]);

  const resetFilters = useCallback((filter = {}) => {
    setFilters(filter);
    handleOnChange(filter);
  }, [handleOnChange]);

  return (
    children({
      onFilterChange: handleFilters,
      filters,
      resetFilters,
    })
  );
};

FilterManager.defaultProps = {
  initialFilters: {},
  onChange: () => { /* This is intentional */ },
  filtersToInclude: [],
  commaSeperated: false,
  filtersOnClear: '',
};

FilterManager.propTypes = {
  initialFilters: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  commaSeperated: PropTypes.bool,
  filtersToInclude: PropTypes.instanceOf(Array),
  filtersOnClear: PropTypes.string,
};

export default FilterManager;
