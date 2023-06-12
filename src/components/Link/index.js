import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useNavigate } from "react-router-dom";

/**
 * @class Components/Link
 */
const Link = ({
  to,
  root,
  className,
  children,
  component: Component,
  disable,
  ...props
}) => {
  const navigate = useNavigate();

  const handleOnClick = (path) => {
    if ("onClick" in props) props.onClick();
    if (!disable && path) navigate(path);
  };

  if (Component === "a") {
    if (disable) return <a {...props}>{children}</a>;
    return (
      <RouterLink to={to} {...props}>
        {children}
      </RouterLink>
    );
  }
  return (
    // eslint-disable-next-line max-len
    <Component
      className={className}
      onClick={() => handleOnClick(to)}
      title={props?.title}
    >
      {disable ? <a>{children}</a> : <RouterLink>{children}</RouterLink>}
    </Component>
  );
};

Link.propTypes = {
  ...RouterLink.propTypes,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  root: PropTypes.bool,
  disable: PropTypes.bool,
};

Link.defaultProps = {
  ...RouterLink.defaultProps,
  component: "a",
  root: false,
  disable: false,
};

export default React.memo(Link);
