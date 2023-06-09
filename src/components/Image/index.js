import React from 'react';
import PropTypes from 'prop-types';

const Image = ({
  name, alt, url, ...props
}) => (
  <img src={url || `${process.env.PUBLIC_URL}/images/${name}`} alt={alt} {...props} />
);

Image.propTypes = {
  name: PropTypes.string.isRequired,
  alt: PropTypes.string,
  url: PropTypes.string,
};

Image.defaultProps = {
  alt: '',
  url: '',
};

export default Image;
