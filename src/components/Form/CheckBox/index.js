import React from 'react';
import {
  Form, Checkbox, Row, Col,
} from 'antd';
import PropTypes from 'prop-types';
import './checkbox.scss';
import classNames from 'classnames';

const CheckBox = ({
  name,
  className,
  label,
  labelSpan,
  inputSpan,
  required,
  checked,
  id,
  onClick,
  key,
  component: Component,
  options,
  labelAfter,
  children,
  onChange,
  disabled,
  onBlur,
  dataTestId,
  checkBoxProps,
  ...otherProps
}) => (
  <div className="custom-checkbox">
    <Row>
      <Col span={labelSpan} order={labelAfter && 1} className={classNames({ space: labelAfter })}>
        <div className="ant-form-item-label ant-form-item-label-left">
          <label
            className={classNames('ant-form-item-no-colon')}
            title={label}
            htmlFor={id}
          >
            {label}
          </label>
          <span className={classNames('req-star', required && 'ant-form-item-required')} />
        </div>
      </Col>
      <Col span={inputSpan}>
        <Form.Item
          className={className}
          name={name}
          required
          {...otherProps}
        >
          <Component
            onClick={onClick}
            onChange={onChange}
            checked={checked}
            id={id}
            key={key}
            options={options}
            disabled={disabled}
            onBlur={onBlur}
            data-testid={dataTestId || name}
            {...checkBoxProps}
          >
            {children}
          </Component>
        </Form.Item>
      </Col>
    </Row>
  </div>
);

CheckBox.Group = Checkbox.Group;

CheckBox.defaultProps = {
  name: '',
  label: '',
  onClick: (event) => event.stopPropagation(),
  required: false,
  checked: false,
  labelSpan: 10,
  inputSpan: 14,
  component: Checkbox,
  className: '',
  id: '',
  options: [],
  key: '',
  labelAfter: false,
  children: [],
  onChange: () => { /* This is intentional */ },
  disabled: false,
  onBlur: () => { /* This is intentional */ },
  dataTestId: '',
  checkBoxProps: {},
};

CheckBox.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  label: PropTypes.string,
  onClick: PropTypes.func,
  required: PropTypes.bool,
  checked: PropTypes.bool,
  labelSpan: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  inputSpan: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  component: PropTypes.element,
  className: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  options: PropTypes.instanceOf(Array),
  key: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  labelAfter: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
  dataTestId: PropTypes.string,
  checkBoxProps: PropTypes.instanceOf(PropTypes.object),
};

export default CheckBox;
