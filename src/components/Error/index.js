import React from 'react';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';

function Error(props) {
  const { messages } = props;
  return (
    <div>
      {isArray(messages) ? (
        messages.map((item, index) => <div key={`error${index}`}>{item}</div>)
      ) : (
        <span>{messages}</span>
      )}
    </div>
  );
}

Error.defaultProps = {
  messages: '',
};

Error.propTypes = {
  messages: PropTypes.string,
};

export default Error;
