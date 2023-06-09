import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  Form, DatePicker as DatePickerComponent, Row, Col,
} from 'antd';
import cloneDeep from 'lodash/cloneDeep';

import './datePicker.scss';

const DatePicker = (props) => {
  const {
    label,
    name,
    placeholder,
    showTime,
    dateFormat,
    tabIndex,
    required,
    rules,
    onChange,
    value,
    className,
    inputSpan,
    labelSpan,
    disabled,
    id,
    disabledDate,
    picker,
    shouldShowWarningText,
    allowClear,
    Component,
    datePickerProps,
    dataTestId,
    ...otherProps
  } = props;

  const clonedRules = cloneDeep(rules);
  if (required) {
    clonedRules.push({
      required: true,
      message: shouldShowWarningText ? `${label} is required` : ' ',
    });
  }
  return (
    <div className="custom-picker">
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
          <Form.Item
            name={name}
            rules={[...clonedRules]}
            {...otherProps}
          >
            <Component
              value={value}
              defaultValue={value}
              picker={picker}
              placeholder={placeholder}
              format={dateFormat}
              showTime={showTime}
              tabIndex={tabIndex}
              onChange={onChange}
              className={classNames('date-picker', className)}
              disabled={disabled}
              disabledDate={disabledDate}
              allowClear={allowClear}
              data-testid={dataTestId}
              {...datePickerProps}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

DatePicker.defaultProps = {
  labelSpan: 10,
  inputSpan: 14,
  name: '',
  label: '',
  required: false,
  showTime: false,
  dateFormat: ['MM/DD/YYYY', 'MMDDYYYY', 'M/D/YYYY'],
  onChange: () => { /* This is intentional */ },
  disabled: false,
  disabledDate: () => { /* This is intentional */ },
  rules: [],
  className: '',
  id: '',
  tabIndex: 0,
  value: '',
  picker: 'date',
  shouldShowWarningText: true,
  Component: DatePickerComponent,
  allowClear: true,
  datePickerProps: {},
};

DatePicker.propTypes = {
  labelSpan: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  inputSpan: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  name: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  allowClear: PropTypes.bool,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  showTime: PropTypes.bool,
  dateFormat: PropTypes.instanceOf(Array),
  disabled: PropTypes.bool,
  rules: PropTypes.instanceOf(Array),
  disabledDate: PropTypes.func,
  tabIndex: PropTypes.number,
  value: PropTypes.string,
  picker: PropTypes.string,
  shouldShowWarningText: PropTypes.bool,
  Component: PropTypes.node,
  datePickerProps: PropTypes.instanceOf(Object),
};

export default DatePicker;
