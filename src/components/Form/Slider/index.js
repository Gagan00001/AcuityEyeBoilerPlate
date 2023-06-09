import React from 'react';
import {
  Form, Row, Col, Slider,
} from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const InputSlider = ({
  name,
  className,
  label,
  labelSpan,
  inputSpan,
  required,
  id,
  key,
  labelAfter,
  children,
  onChange,
  min,
  max,
  defaultValue,
  step,
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
        <Form.Item className={className} name={name} required {...otherProps}>
          <Slider
            onChange={onChange}
            key={key}
            id={id}
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
          >
            {children}
          </Slider>
        </Form.Item>
      </Col>
    </Row>
  </div>
);

InputSlider.defaultProps = {
  name: '',
  label: '',
  required: false,
  labelSpan: 10,
  inputSpan: 14,
  defaultValue: 0,
  max: 100,
  min: 0,
  step: 1,
  id: '',
  key: '',
  labelAfter: false,
  className: '',
  onChange: () => { /* This is intentional */ },
  children: [],
};

InputSlider.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  labelSpan: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  inputSpan: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  key: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  labelAfter: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default React.memo(InputSlider);
