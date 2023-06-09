import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form, InputNumber, Row, Col,
} from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import classNames from 'classnames';

import './index.scss';

const formatter = (text) => {
  if (text) {
    const pureText = text.replace(/\D/g, '');
    const n = (index) => pureText[index] || '';
    const spcl = (length, char) => (pureText.length >= length ? char : '');
    return `${spcl(1, '(')}${n(0)}${n(1)}${n(2)}${spcl(4, ') ')}${n(3)}${n(4)}${n(5)}${spcl(7, '-')}${pureText.substring(6)}`;
  }
  return '';
};

const validationChecker = (condition, errorMessage) => {
  if (condition) {
    return Promise.resolve();
  }
  return Promise.reject(errorMessage);
};

const maxValueLengthValidator = (label, maxValueLength) => (rules, number = '') => validationChecker(
  `${number}`.length <= maxValueLength,
  `${label} cannot be longer than ${maxValueLength} digits`,
);
const minValueLengthValidator = (label, minValueLength) => (rules, number = '') => validationChecker(
  `${number ?? ''}`.length === 0 || `${number ?? ''}`.length >= minValueLength,
  `${label} must be at least ${minValueLength} digits`,
);

const PhoneNumberInput = ({
  options,
  onChange,
  className,
  value,
  label,
  name,
  inputSpan,
  labelSpan,
  required,
  rules,
  id,
  inputProps,
  isFormItem,
  maxValueLength,
  minValueLength,
  disabled,
  placeholder,
  ...otherProps
}) => {
  const clonedRules = cloneDeep(rules);
  if (required) {
    clonedRules.push({
      required: true,
      message: `${label} is required`,
    });
  }

  if (maxValueLength) {
    clonedRules.push({ validator: maxValueLengthValidator(label, maxValueLength) });
  }
  if (minValueLength) {
    clonedRules.push({ validator: minValueLengthValidator(label, minValueLength) });
  }

  const Component = useCallback(({ ...props }) => (
    <InputNumber
      formatter={formatter}
      parser={(text) => text.replace(/\D/g, '')}
      {...props}
      step={0}
      placeholder={placeholder}
    />
  ), []);

  return (
    <div className={classNames('custom-input', className)}>
      <Row>
        <Col span={labelSpan}>
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
          {isFormItem ? (
            <Form.Item
              name={name}
              rules={[
                ...clonedRules,
              ]}
              {...otherProps}
            >
              <Component onChange={onChange} disabled={disabled} {...inputProps} />
            </Form.Item>
          )
            : (
              <Component onChange={onChange} value={value} disabled={disabled} {...inputProps} />
            )}
        </Col>
      </Row>
    </div>
  );
};

PhoneNumberInput.defaultProps = {
  rules: [],
  label: '',
  name: '',
  inputSpan: 10,
  labelSpan: 14,
  required: false,
  disabled: false,
  id: '',
  onChange: () => { /* This is intentional */ },
  className: '',
  value: '',
  inputProps: {},
  isFormItem: true,
  maxValueLength: null,
  minValueLength: null,
};

PhoneNumberInput.propTypes = {
  labelSpan: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  inputSpan: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  rules: PropTypes.instanceOf(Array),
  onChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  inputProps: PropTypes.instanceOf(Object),
  isFormItem: PropTypes.bool,
  maxValueLength: PropTypes.number,
  minValueLength: PropTypes.number,
};

export default React.memo(PhoneNumberInput);
