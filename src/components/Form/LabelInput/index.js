import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Input, Row, Col,
} from 'antd';
import './index.scss';
import classNames from 'classnames';

function LabelInput({
  label,
  value,
  name,
  required,
  labelSpan,
  inputSpan,
  disabled,
  id,
  ...otherProps
}) {
  return (
    <div className="custom-input-disabled">
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
            {...otherProps}
          >
            <Input value={value} disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
LabelInput.defaultProps = {
  name: '',
  label: '',
  required: false,
  disabled: true,
  labelSpan: 10,
  inputSpan: 14,
  id: 'label-input',
  value: '',
};

LabelInput.propTypes = {
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
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export default React.memo(LabelInput);
