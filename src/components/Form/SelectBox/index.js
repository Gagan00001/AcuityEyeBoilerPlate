import React, { useMemo } from 'react';
import {
  Form, Select, Row, Col,
} from 'antd';
import PropTypes from 'prop-types';
import './select.scss';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import EventWrapper from '../../EventWrapper';

function SelectBox(props) {
  const {
    options,
    selectedOption,
    allowClear,
    label,
    name,
    value,
    required,
    disabled,
    onChange,
    rules,
    placeholder,
    labelSpan,
    inputSpan,
    loading,
    selectProps,
    className,
    mode,
    defaultValue,
    filterOption,
    shouldShowWarningText,
    dropdownMatchSelectWidth,
    dataTestId,
    optionRenderer,
    valueAccessor,
    inActiveOption,
    nameAccessor,
    ...otherProps
  } = props;

  const clonedRules = [...rules];
  if (required) {
    clonedRules.push({
      required: true,
      message: shouldShowWarningText ? `${label} is required` : ' ',
    });
  }

  const selectOptions = useMemo(() => {
    if (options?.length && !isEmpty(inActiveOption)) {
      const inActiveOptionExists = options?.find(
        (option) => option?.[valueAccessor] === inActiveOption?.[valueAccessor]);
      if (!inActiveOptionExists) {
        Object.assign(inActiveOption || {}, {
          name: inActiveOption?.[nameAccessor],
          value: inActiveOption?.[valueAccessor],
        });
        return [...options, inActiveOption || {}];
      }
      return options;
    }
    return options;
  }, [inActiveOption, nameAccessor, options, valueAccessor]);

  return (
    <div className={classNames('custom-select', className)}>
      <Row>
        <Col span={labelSpan}>
          <div className="ant-form-item-label ant-form-item-label-left">
            <EventWrapper
              type="label"
              className={classNames('ant-form-item-no-colon')}
              title={label}
            >
              {label}
            </EventWrapper>
            <span className={classNames('req-star', required && 'ant-form-item-required')} />
          </div>
        </Col>
        <Col span={inputSpan}>
          <Form.Item
            name={name}
            rules={[
              ...clonedRules,
            ]}
            // valuePropName={{ value }}
            {...otherProps}
          >
            <Select
              placeholder={placeholder}
              onChange={onChange || selectedOption}
              allowClear={allowClear}
              value={value}
              loading={loading}
              disabled={disabled}
              dropdownMatchSelectWidth={dropdownMatchSelectWidth}
              mode={mode}
              defaultValue={defaultValue}
              filterOption={filterOption}
              optionFilterProp="children"
              data-testid={dataTestId || name}
              // getPopupContainer={(trigger) => trigger?.parentNode}
              {...selectProps}
            >
              {selectOptions
                && (selectOptions).map((item) => {
                  const option = optionRenderer ? optionRenderer(item) : item;
                  return (
                    <Select.Option
                      key={option.value}
                      value={option.value}
                      item={option}
                      label={option.label}
                      title={option?.title || option?.item?.name || option?.name}
                      data-testid={option.value}
                    >
                      {option?.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}

SelectBox.defaultProps = {
  options: [],
  label: '',
  name: '',
  required: false,
  disabled: false,
  rules: [],
  placeholder: 'Select an option',
  labelSpan: 10,
  inputSpan: 14,
  allowClear: true,
  value: undefined,
  defaultValue: undefined,
  selectedOption: null,
  onChange: () => { /* This is intentional */ },
  tabIndex: 0,
  loading: false,
  selectProps: {
    showSearch: true,
  },
  className: '',
  mode: undefined,
  onClick: (event) => event.stopPropagation(),
  filterOption: undefined,
  shouldShowWarningText: true,
  dropdownMatchSelectWidth: false,
  dataTestId: '',
  optionRenderer: undefined,
  nameAccessor: '',
  valueAccessor: '',
  inActiveOption: {},
};

SelectBox.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
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
  options: PropTypes.instanceOf(Array),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  rules: PropTypes.instanceOf(Array),
  selectedOption: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  selectProps: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  mode: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  filterOption: PropTypes.func,
  shouldShowWarningText: PropTypes.bool,
  dropdownMatchSelectWidth: PropTypes.bool,
  dataTestId: PropTypes.string,
  optionRenderer: PropTypes.node,
  valueAccessor: PropTypes.string,
  inActiveOption: PropTypes.instanceOf(Object),
  nameAccessor: PropTypes.string,
};

export default React.memo(SelectBox);
