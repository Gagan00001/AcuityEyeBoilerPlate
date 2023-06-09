import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import SearchBox from '../../Search';

import './search.scss';

const Search = ({
  id, name, placeholder, onChange, value: initialValue, ...otherProps
}) => {
  const [value, setValue] = useState(initialValue);
  const handleOnChange = useCallback((e) => {
    const { target: { value: filterValue } } = e;
    if (filterValue.length < 3 && initialValue) {
      onChange({ target: { value: null, name } });
    } else if (filterValue && filterValue.length >= 3) {
      onChange(e);
    }
    setValue(filterValue);
  }, [initialValue, name, onChange]);

  return (
    <div className="filter-ant-search">
      <div className="ant-search">
        <SearchBox id={id} name={name} placeholder={placeholder} value={value || ''} onChange={handleOnChange} {...otherProps} />
      </div>
    </div>
  );
};

Search.defaultProps = {
  placeholder: '',
  name: '',
  id: '',
  onChange: () => { /* This is intentional */ },
  value: '',
};

Search.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default Search;
