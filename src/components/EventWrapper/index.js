import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const EventWrapper = forwardRef(
  ({ type: Component, children, className, title, ...otherProps }, ref) => {
    return (
      <Component ref={ref} className={className} title={title} {...otherProps}>
        {children}
      </Component>
    );
  }
);

EventWrapper.defaultProps = {
  type: "div",
  className: "",
  children: [],
};

EventWrapper.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default EventWrapper;
