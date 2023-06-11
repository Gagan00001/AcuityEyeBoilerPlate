import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./button.scss";

const Button = React.forwardRef(
  ({ children, type, className, ...props }, ref) => (
    // eslint-disable-next-line react/button-has-type
    <button
      type={type}
      className={classNames("btn", className)}
      ref={ref}
      data-testid="commonBtn"
      {...props}
    >
      {children}
    </button>
  )
);

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Button.defaultProps = {
  type: "button",
  className: "",
  children: [],
};

export default React.memo(Button);
