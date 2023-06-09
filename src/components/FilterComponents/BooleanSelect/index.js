import React, {
  useCallback, useMemo, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash//omit';
import intersection from 'lodash/intersection';
import SelectBox from '../../SelectBox';
import './booleanselectbox.scss';

const BooleanSelect = ({
  options, onChange, name, id, filters, defaultValue, ...otherProps
}) => {
  const [selectValue, setValue] = useState(null);

  const allValues = useMemo(() => options.filter((item) => item.value)
    .map((item) => item.value), [options]);

  const handleOnChange = useCallback((value) => {
    setValue(value);
    const updatedFilters = omit(filters, allValues);
    if (Array.isArray(value)) {
      const newFilters = {};
      value.forEach((filter) => { newFilters[filter] = true; });
      onChange({ ...updatedFilters, ...newFilters }, true);
    } else if (value === defaultValue) {
      onChange(updatedFilters, true);
    } else if (value) {
      onChange({ ...updatedFilters, [value]: true }, true);
    }
  }, [onChange, filters, allValues, defaultValue]);

  useEffect(() => {
    const presentOption = intersection(allValues, Object.keys(filters));
    if (presentOption.length) {
      setValue(presentOption[0]);
    } else {
      setValue(defaultValue);
    }
  }, [filters, allValues, defaultValue]);

  return (
    <div className="input-wrap filter-select-box">
      <SelectBox
        onChange={handleOnChange}
        options={options}
        value={selectValue}
        name={name}
        id={id}
        {...otherProps}
      />
    </div>
  );
};

BooleanSelect.defaultProps = {
  options: [],
  onChange: () => { /* This is intentional */ },
  name: '',
  id: '',
  defaultValue: '',
  filters: {},
};

BooleanSelect.propTypes = {
  options: PropTypes.instanceOf(Array),
  onChange: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  filters: PropTypes.instanceOf(Object),
};

export default BooleanSelect;
