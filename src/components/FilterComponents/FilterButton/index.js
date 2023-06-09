import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FilterButton.scss';

const FilterButton = (props) => {
  const {
    placeholder, name, id, onChange, value,
  } = props;
  const updateValue = (value && value === 'true' ? 'false' : 'true') || 'true';
  return (
    <button
      type="button"
      className={classNames('btn btn-primary sm-btn filter-button', value === 'true' ? 'active' : '')}
      name={name}
      id={id}
      onClick={onChange}
      value={updateValue}
    >
      {placeholder}
    </button>
  );
};

FilterButton.defaultProps = {
  placeholder: '',
  name: '',
  id: '',
  onChange: () => { /* This is intentional */ },
  value: '',
};

FilterButton.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default FilterButton;
