import React, {
  useCallback, useMemo, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash//omit';
import SelectBox from '../../SelectBox';
import './booleanselectbox.scss';

const Select = ({
  options, onChange, name, id, filters, defaultValue, ...otherProps
}) => {
  const [selectValue, setValue] = useState(null);

  const allValues = useMemo(() => options.filter((item) => item.value)
    .map((item) => item.value), [options]);

  const handleOnChange = useCallback((value) => {
    setValue(value);
    const updatedFilters = omit(filters, allValues);
    if (value === defaultValue) {
      onChange(updatedFilters, true);
    } else if (value) {
      onChange({ ...updatedFilters, [name]: value }, true);
    } else if (!value) {
      onChange({ ...omit(updatedFilters, name) }, true);
    }
  }, [onChange, filters, allValues, defaultValue, name]);

  useEffect(() => {
    setValue(filters && filters[name]);
  }, [filters, name]);

  return (
    <div className="input-wrap filter-select-box">
      <SelectBox
        {...otherProps}
        onChange={handleOnChange}
        options={options}
        value={selectValue}
        name={name}
        id={id}
        isFormItem={false}
      />
    </div>
  );
};

Select.defaultProps = {
  placeholder: '',
  name: '',
  id: '',
  onChange: () => { /* This is intentional */ },
  value: '',
  filters: {},
  options: [],
  defaultValue: '',
};

Select.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  filters: PropTypes.instanceOf(Object),
  options: PropTypes.instanceOf(Array),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default Select;
