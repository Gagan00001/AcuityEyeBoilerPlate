import React from 'react';
import PropTypes from 'prop-types';

const Recently = ({
  name, placeholder, onChange, value, id,
}) => (
  <div className="cus-input-wrap">
    <span className="icon sprite-img clock" />
    <input type="text" name={name} placeholder={placeholder} onChange={onChange} value={value} id={id} />
  </div>
);

Recently.defaultProps = {
  placeholder: '',
  name: '',
  id: '',
  onChange: () => { /* This is intentional */ },
  value: '',
};

Recently.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default Recently;
