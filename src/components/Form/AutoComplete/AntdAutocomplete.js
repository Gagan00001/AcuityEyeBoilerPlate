import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form, AutoComplete, Row, Col, Spin,
} from 'antd';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

import classNames from 'classnames';

import isEqual from 'lodash/isEqual';
import useCRUD from '../../../hooks/useCRUD';

import './AutoComplete.scss';
import EventWrapper from '../../EventWrapper';

const fixAutoComplete = () => {
  document.querySelectorAll('.ant-select-selector input').forEach((e) => {
    e.setAttribute('autocomplete', 'new-password');
  });
};

const AntdAutoComplete = (props) => {
  const {
    label,
    name,
    required,
    placeholder,
    tabIndex,
    labelSpan,
    inputSpan,
    url,
    onSelect,
    disabled,
    rules = [],
    optionParser,
    optionMaster,
    params: propsParams,
    initialValue,
    optionRenderer,
    dropdownMatchSelectWidth,
    debounceSearch,
    debounceDuration,
    minCharLength,
    allowClearOnSelect,
    onSearch,
    setError,
    setAutoCompleteValue,
    className,
    virtual,
    notFoundContent,
    allowClearOnBlur,
    autoCompleteProps,
    resetOnParamChange,
    onSearchTextChange,
    dataTestId,
    ...otherProps
  } = props;
  const clonedRules = [...rules];
  if (required) {
    clonedRules.push({
      required: true,
      message: `${label} is required`,
    });
  }
  const [data, setData] = useState({ options: [], isInitialFetched: false });
  const [isAllowClear, setIsAllowClear] = useState(allowClearOnBlur);
  const [params, setParams] = useState(propsParams);

  const [selectedValue, setSelectedValue] = useState(undefined);
  const [defaultVal, setDefault] = useState('');

  // eslint-disable-next-line no-unused-vars
  const [response,, loading, getOptions] = useCRUD({
    id: url, url, type: 'read',
  });

  const fetchUser = useCallback(debounce((value) => {
    if (value.length >= minCharLength) {
      getOptions({ [optionMaster]: value, ...params });
    }
  }, debounceDuration), [getOptions, minCharLength, optionMaster, params]);

  const fetchUserWithDebounce = useCallback((value) => {
    fetchUser(value);
    setData({ options: [], isFetching: true, isInitialFetched: true });
    if (onSearchTextChange) onSearchTextChange(value);
  }, [fetchUser, onSearchTextChange]);

  const onOptionSelect = useCallback((value, allItems) => {
    onSelect(value, allItems);
    if (allowClearOnSelect) {
      setSelectedValue('');
    }
    setIsAllowClear(false);
  }, [onSelect, setSelectedValue, allowClearOnSelect]);

  useEffect(() => {
    if (setAutoCompleteValue) {
      setAutoCompleteValue(() => setSelectedValue);
    }
    setTimeout(() => {
      fixAutoComplete();
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEqual(propsParams, params)) {
      setParams(propsParams);
    }
  }, [propsParams]);

  useEffect(() => {
    if (resetOnParamChange) {
      setData({ options: [], isInitialFetched: false });
      setSelectedValue('');
      if (onSelect) {
        onSelect(null, { item: {} });
      }
    }
  }, [resetOnParamChange, params]);

  useEffect(() => {
    if (initialValue && Object.values(initialValue).length) {
      setData({
        options: (initialValue && [initialValue]) || [],
        isFetching: false,
        isInitialFetched: false,
      });
      setSelectedValue(initialValue.value);
      setDefault(initialValue.name);
    } else {
      setData({
        options: [],
        isFetching: false,
        isInitialFetched: false,
      });
      setSelectedValue();
      setDefault();
    }
  }, [initialValue]);

  useEffect(() => {
    if (data.isInitialFetched) {
      let initialOptions = [];
      if (isArray(response)) {
        initialOptions = response;
      } else if (isObject(response)) {
        initialOptions = get(response, 'result', []);
      }
      setData({
        options: (initialOptions.map((item) => optionParser(item))) || [],
        isInitialFetched: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const { options, isInitialFetched } = data;

  const getNoContent = () => {
    if (loading || data?.isFetching) {
      return (<Spin />);
    }
    if (isInitialFetched) {
      return (<span>{notFoundContent}</span>);
    }
    return null;
  };

  const onBlur = useCallback(
    () => {
      if (isAllowClear) {
        setSelectedValue('');
        if (setError) {
          setError();
        }
      }
      setData({ options, isFetching: false, isInitialFetched: false });
    },
    [isAllowClear, options, setError],
  );

  const onChange = useCallback((value) => {
    setSelectedValue(value);
    if (allowClearOnBlur) setIsAllowClear(true);
  }, [allowClearOnBlur]);

  return (
    <div className={classNames('custom-autocomplete', className)}>
      <Row>
        <Col span={labelSpan || 10}>
          <div className="ant-form-item-label ant-form-item-label-left">
            <EventWrapper
              type="label"
              className={classNames('ant-form-item-no-colon', required && 'ant-form-item-required')}
              title={label}
            >
              {label}
            </EventWrapper>
            <span className={classNames('req-star', required && 'ant-form-item-required')} />
          </div>
        </Col>
        <Col span={inputSpan || 14}>
          <Form.Item
            name={name}
            rules={clonedRules}
            {...otherProps}
          >
            <div className="auto-complete-search">
              <AutoComplete
                placeholder={placeholder}
                tabIndex={tabIndex}
                onSearch={onSearch || fetchUserWithDebounce}
                filterOption={false}
                showSearch
                notFoundContent={getNoContent()}
                onSelect={onOptionSelect}
                dropdownMatchSelectWidth={dropdownMatchSelectWidth}
                onBlur={onBlur}
                disabled={disabled}
                options={optionRenderer(options)}
                value={selectedValue}
                defaultValue={defaultVal}
                onChange={onChange}
                virtual={virtual}
                data-testid={dataTestId || name}
                // getPopupContainer={(trigger) => trigger?.parentNode}
                {...autoCompleteProps}
              />
              <span className="auto-search-icon sprite-img-before" />
            </div>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

AntdAutoComplete.defaultProps = {
  placeholder: 'Search',
  optionParser: (option) => option,
  params: {},
  rules: [],
  optionRenderer: (options) => options,
  debounceSearch: true,
  debounceDuration: 1000,
  initialValue: null,
  virtual: true,
  label: '',
  name: '',
  required: false,
  labelSpan: 14,
  inputSpan: 10,
  url: '',
  onSelect: () => { /* This is intentional */ },
  onClick: (event) => event.stopPropagation(),
  disabled: false,
  optionMaster: '',
  dropdownMatchSelectWidth: '100%',
  minCharLength: 3,
  allowClearOnSelect: false,
  onSearch: null,
  setError: null,
  setAutoCompleteValue: null,
  className: '',
  notFoundContent: 'Not Found',
  allowClearOnBlur: true,
  autoCompleteProps: {},
  onSearchTextChange: () => { /* This is intentional */ },
};

AntdAutoComplete.propTypes = {
  placeholder: PropTypes.string,
  optionParser: PropTypes.func,
  params: PropTypes.instanceOf(Object),
  rules: PropTypes.instanceOf(Array),
  optionRenderer: PropTypes.func,
  debounceSearch: PropTypes.bool,
  debounceDuration: PropTypes.number,
  initialValue: PropTypes.instanceOf(Array),
  virtual: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  required: PropTypes.bool,
  labelSpan: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  inputSpan: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  url: PropTypes.string,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  optionMaster: PropTypes.string,
  dropdownMatchSelectWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  minCharLength: PropTypes.number,
  allowClearOnSelect: PropTypes.bool,
  onSearch: PropTypes.func,
  setError: PropTypes.func,
  setAutoCompleteValue: PropTypes.func,
  className: PropTypes.string,
  onClick: PropTypes.func,
  notFoundContent: PropTypes.string,
  allowClearOnBlur: PropTypes.bool,
  autoCompleteProps: PropTypes.instanceOf(Object),
  onSearchTextChange: PropTypes.func,
};

export default AntdAutoComplete;
