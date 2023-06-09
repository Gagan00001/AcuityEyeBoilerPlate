import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker as DatePickerComponent } from 'antd';

const Date = ({
  name, placeholder, onChange, value, id,
}) => (
  <DatePickerComponent type="text" name={name} placeholder={placeholder} onChange={onChange} value={value} id={id} />
);

Date.defaultProps = {
  name: '',
  placeholder: '',
  onChange: () => { /* This is intentional */ },
  value: '',
  id: '',
};

Date.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export default Date;
