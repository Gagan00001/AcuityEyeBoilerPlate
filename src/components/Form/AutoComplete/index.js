import React, {
  useState, useEffect, useMemo, useCallback, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  Form, Select, Row, Col, Spin,
} from 'antd';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import times from 'lodash/times';

import get from 'lodash/get';

import classNames from 'classnames';

import useCRUD from '../../../hooks/useCRUD';

import './AutoComplete.scss';
import EventWrapper from '../../EventWrapper';

const fixAutoComplete = () => {
  document.querySelectorAll('.ant-select-selector input').forEach((e) => {
    e.setAttribute('autocomplete', 'off');
  });
  document.querySelectorAll('.ant-select-selection-search-input').forEach((e) => {
    e.setAttribute('autocomplete', 'off');
  });
};

const AutoComplete = (props) => {
  const {
    label,
    name,
    required,
    placeholder,
    labelSpan,
    inputSpan,
    url,
    onSelect,
    disabled,
    rules,
    optionParser,
    optionMaster,
    params,
    initialValue,
    selectProps,
    showArrow,
    fetchInitial,
    setFirstOptionSelected,
    notFoundContent,
    optionRenderer,
    optionHeaderRenderer,
    isFormItem,
    dropdownMatchSelectWidth,
    minCharLength,
    className,
    isInputTextEditable,
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

  const containerRef = useRef();

  const [data, setData] = useState({ options: [], isFetching: false, isInitialFetched: false });
  const [isFetchInitial, setFetchInitial] = useState(fetchInitial);
  const [searchValue, setSearchValue] = useState(fetchInitial);

  // eslint-disable-next-line no-unused-vars
  const [response,,, getOptions] = useCRUD({
    id: url + name, url, type: 'read',
  });

  const handleOptions = useMemo(() => debounce(getOptions, 1000), [getOptions]);

  const fetchUser = (value) => {
    setSearchValue(value);
    if (value?.length >= minCharLength) {
      setData({ options: [], isFetching: true, isInitialFetched: true });
      handleOptions({ [optionMaster]: value, ...params });
    } else {
      setData({ options: [], isFetching: false, isInitialFetched: false });
    }
  };

  useEffect(() => {
    if (fetchInitial) {
      getOptions({ ...params });
      setData({ options: [], isFetching: true, isInitialFetched: true });
    }
  }, [fetchInitial, getOptions, params, setData]);

  const setOption = useCallback(() => {
    let initialOptions = [];
    if (isArray(response)) {
      initialOptions = response;
    } else if (isObject(response)) {
      initialOptions = get(response, 'result', []);
    }
    setData({
      options: (initialOptions.map((item) => optionParser(item))) || [],
      isFetching: false,
      isInitialFetched: true,
    });
  }, [response, optionParser]);

  useEffect(() => {
    if (isFetchInitial) {
      setOption(response);
      if (setFirstOptionSelected && typeof onSelect === 'function' && data.options[0]) {
        setFetchInitial(false);
        onSelect([{ item: data.options[0] }]);
      }
    }
  }, [isFetchInitial, response, optionParser, onSelect, data, setFirstOptionSelected, setOption]);

  useEffect(() => {
    setTimeout(() => {
      fixAutoComplete();
    }, 1000);
  }, []);

  useEffect(() => {
    setData({
      options: (initialValue && !isEmpty(initialValue) && [initialValue]) || [],
      isInitialFetched: false,
      isFetching: false,
    });
  }, [initialValue]);

  useEffect(() => {
    if ((response && response.length) || (response?.result?.length)) {
      setOption(response);
    } else {
      setData({ options: [], isFetching: false, isInitialFetched: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const onChange = (value, allItems) => {
    const { item } = allItems || {};
    if (typeof onSelect === 'function') {
      onSelect(item || allItems);
    }
  };

  const handleOnSelect = useCallback((value) => {
    if (isInputTextEditable) {
      const spans = containerRef.current?.getElementsByClassName('ant-select-selection-item');
      setTimeout(() => {
        times(spans.length, (index) => {
          spans[index].innerHTML = '';
        });
        setSearchValue(value);
      }, 10);
    }
  }, [isInputTextEditable]);

  const handleOnFocus = useCallback(() => {
    if (isInputTextEditable) {
      const spans = containerRef.current?.getElementsByClassName('ant-select-selection-item');
      if (spans && spans.length) {
        const { innerHTML } = spans[0];
        setTimeout(() => {
          setSearchValue(innerHTML);
        }, 10);
      }
    }
  }, [isInputTextEditable]);

  const { options, isFetching, isInitialFetched } = data;
  const getNoContent = () => {
    if (isFetching) {
      return (<Spin />);
    }
    if (isInitialFetched) {
      return (<span>{notFoundContent}</span>);
    }
    return null;
  };

  const handleEnterPress = useCallback((e) => {
    if (e.key === 'Enter') {
      if (!options || !options?.length) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, [options]);

  const select = (
    <Select
      placeholder={(name === 'zip' || name === 'zipCode') ? 'Search an option' : placeholder}
      searchValue={searchValue}
      onSearch={fetchUser}
      filterOption={false}
      showSearch
      notFoundContent={getNoContent()}
      onChange={onChange}
      onSelect={handleOnSelect}
      onFocus={handleOnFocus}
      onBlur={() => setData({ options, isFetching: false, isInitialFetched: false })}
      disabled={disabled}
      showArrow={showArrow}
      onInputKeyDown={handleEnterPress}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      data-testid={dataTestId || name}
      dropdownRender={(menu) => (
        <div className="content-on-middle">
          {optionHeaderRenderer ? <div className="ant-select-item-dlt-center ant-select-item-group-dlt-center"><div className="option-header-main-wrapper">{optionHeaderRenderer(options)}</div></div> : ''}
          {menu}
        </div>
      )}
      // getPopupContainer={(trigger) => trigger?.parentNode}
      {...selectProps}
    >
      {options
    && options.map((item) => (
      <Select.Option
        key={item.id}
        item={item}
        value={item.value}
        className="ant-select-item-option-grouped"
      >
        {optionRenderer(item)}
      </Select.Option>
    ))}
    </Select>
  );
  return (
    <div className={classNames('custom-autocomplete replace-search-arrow', className)}>
      <Row>
        <Col span={labelSpan || 10}>
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
        <Col span={inputSpan || 14}>
          <div ref={containerRef} className="auto-complete-search">
            {isFormItem ? (
              <Form.Item
                name={name}
                rules={clonedRules}
                {...otherProps}
              >
                {select}
              </Form.Item>
            )
              : select}
            {!showArrow && <span className="auto-search-icon sprite-img-before" />}
          </div>
        </Col>
      </Row>
    </div>
  );
};

AutoComplete.defaultProps = {
  placeholder: 'Select an option',
  optionParser: (option) => option,
  params: {},
  rules: [],
  selectProps: {},
  showArrow: false,
  fetchInitial: false,
  setFirstOptionSelected: false,
  label: '',
  name: '',
  required: false,
  labelSpan: 14,
  inputSpan: 10,
  url: '',
  onSelect: null,
  disabled: false,
  optionMaster: '',
  dropdownMatchSelectWidth: false,
  minCharLength: 3,
  allowClearOnSelect: false,
  className: '',
  initialValue: null,
  notFoundContent: 'Not Found',
  optionRenderer: (item) => item.name,
  optionHeaderRenderer: undefined,
  isFormItem: true,
  isInputTextEditable: false,
};

AutoComplete.propTypes = {
  placeholder: PropTypes.string,
  optionParser: PropTypes.func,
  params: PropTypes.instanceOf(Object),
  rules: PropTypes.instanceOf(Array),
  selectProps: PropTypes.instanceOf(Object),
  showArrow: PropTypes.bool,
  fetchInitial: PropTypes.bool,
  setFirstOptionSelected: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  labelSpan: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  inputSpan: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
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
  className: PropTypes.string,
  initialValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  notFoundContent: PropTypes.string,
  optionRenderer: PropTypes.func,
  optionHeaderRenderer: PropTypes.func,
  isFormItem: PropTypes.bool,
  isInputTextEditable: PropTypes.bool,
};

export default React.memo(AutoComplete);
