import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Radio as RadioButton, Row, Col,
} from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import classNames from 'classnames';

import './radio.scss';

const Radio = ({
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
  radioProps,
  isFormItem,
  ...otherProps
}) => {
  const clonedRules = cloneDeep(rules);
  if (required) {
    clonedRules.push({
      required: true,
      message: `${label} is required`,
    });
  }
  return (
    <div className={classNames('custom-radio', className)}>
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
              <RadioButton.Group onChange={onChange} {...radioProps}>
                {options?.map((item) => (
                  <RadioButton
                    key={item?.value}
                    value={item?.value}
                    name={item?.name}
                    radioName={item?.name}
                    data-testid={item?.value}
                  >
                    {item?.label}
                  </RadioButton>
                ))}
              </RadioButton.Group>
            </Form.Item>
          )
            : (
              <RadioButton.Group
                onChange={onChange}
                options={options}
                value={value}
                {...radioProps}
              />
            )}
        </Col>
      </Row>
    </div>
  );
};

Radio.defaultProps = {
  rules: [],
  label: '',
  name: '',
  inputSpan: 10,
  labelSpan: 14,
  required: false,
  disabled: false,
  id: '',
  options: [],
  onChange: () => { /* This is intentional */ },
  className: '',
  value: '',
  radioProps: {},
  isFormItem: true,
};

Radio.propTypes = {
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
  options: PropTypes.instanceOf(Array),
  onChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  radioProps: PropTypes.instanceOf(Object),
  isFormItem: PropTypes.bool,
};

export default React.memo(Radio);
