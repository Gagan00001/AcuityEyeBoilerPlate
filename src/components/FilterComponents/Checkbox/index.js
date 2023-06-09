import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Smcheckbox from '../../SmCheckbox';

const Checkbox = ({
  name, onChange, value, id, label,
}) => {
  const handleChange = useCallback((e) => onChange(e, false, true), [onChange]);
  return (
    <Smcheckbox
      name={name}
      onChange={handleChange}
      checked={value}
      id={id}
      isFormItem={false}
    >
      {label}
    </Smcheckbox>
  );
};

Checkbox.defaultProps = {
  placeholder: '',
  name: '',
  id: '',
  onChange: () => { /* This is intentional */ },
  value: '',
};

Checkbox.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default Checkbox;
