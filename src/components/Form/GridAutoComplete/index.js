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
import isFunction from 'lodash/isFunction';

import get from 'lodash/get';

import classNames from 'classnames';

import useCRUD from '../../../hooks/useCRUD';

import './AutoComplete.scss';
import EventWrapper from '../../EventWrapper';
import useReduxStoreWithId from '../../../hooks/useReduxStoreWithId';
import Events from '../../../lib/events';

const fixAutoComplete = () => {
  document.querySelectorAll('.ant-select-selector input').forEach((e) => {
    e.setAttribute('autocomplete', 'new-password');
  });
  document.querySelectorAll('.ant-select-selection-search-input').forEach((e) => {
    e.setAttribute('autocomplete', 'new-password');
  });
};

const optionRenderer = (item, columns) => (
  <div className="auto-grid-optionWrapper">
    {columns && columns.map((column) => (
      <span key={column.Header} data-testid={isFunction(column.accessor) ? column.accessor(item, 'title') : item[column.accessor]} title={isFunction(column.accessor) ? column.accessor(item, 'title') : item[column.accessor]} className="auto-grid-option" style={{ flex: column.flex || 1, maxWidth: column.maxWidth || 'auto' }}>
        {isFunction(column.accessor) ? column.accessor(item) : item[column.accessor]}
      </span>
    ))}
  </div>
);
const optionHeaderRenderer = (options, columns) => (options?.length ? (
  <div className="auto-grid-headerWrapper">
    {columns && columns.map((column) => (
      <span key={column.Header} className="auto-grid-header" style={{ flex: column.flex || 1, maxWidth: column.maxWidth || 'auto' }}>
        {column.Header}
      </span>
    ))}
  </div>
) : '');

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
    columns,
    isFormItem,
    value,
    minCharLength,
    onBlur,
    header,
    showTotalCount,
    defaultOptions,
    dropdownMatchSelectWidth,
    className,
    resetOnParamChange,
    allowClear,
    tooltipKey,
    customInnerTextKey,
    onSearchTextChange,
    id,
    dataTestId,
    ...otherProps
  } = props;
  const selectRef = useRef();
  const containerRef = useRef();

  const clonedRules = [...rules];
  if (required) {
    clonedRules.push({
      required: true,
      message: `${label} is required`,
    });
  }

  const [data, setData] = useState({ options: [], isFetching: false, isInitialFetched: false });
  const [searchValue, setSearchValue] = useState();
  const [savedSelectedValue,, setSelectedValue, clearSelectedValue] = useReduxStoreWithId({ id: `gridautocomplete_${url}_${name}` });
  const selectedValue = savedSelectedValue?.get('data');
  const [isFetchInitial, setFetchInitial] = useState(fetchInitial);

  // eslint-disable-next-line no-unused-vars
  const [response,, loading, getOptions] = useCRUD({
    id: id || url, url, type: 'read',
  });

  const setSelectTitle = useMemo(() => debounce((listOfOptions = (data?.options || [])) => {
    if (selectRef.current && listOfOptions && tooltipKey) {
      const { value: selectedValueForTitle, optionLabelProp } = selectRef.current?.props || {};
      const spans = containerRef.current.getElementsByClassName('ant-select-selection-item');
      const selectedObject = listOfOptions.find(
        (option) => (
          (option[optionLabelProp] === selectedValueForTitle)
          || (option.value === selectedValueForTitle)
          || (option.value === parseInt(selectedValueForTitle, 10))),
      );
      if (selectedObject && spans && spans.length) {
        times(spans.length, (index) => {
          const customTooltip = selectedObject[tooltipKey] || selectedValueForTitle;
          spans[index].innerText = selectedObject[customInnerTextKey] || selectedObject.value;
          spans[index].setAttribute('title', customTooltip);
        });
      }
    }
  }, 500), []);

  const handleOptions = useMemo(() => debounce((searchText) => {
    if (searchText?.length >= minCharLength && url) {
      setData({
        options: [], isFetching: true, isInitialFetched: true,
      });
      getOptions({ [optionMaster]: searchText, ...params });
    }
  }, 1000), [getOptions, minCharLength, optionMaster, params, url]);

  const fetchData = (searchText) => {
    setSearchValue(searchText);
    if (onSearchTextChange) onSearchTextChange(searchText);
    handleOptions(searchText);
  };

  useEffect(() => {
    if (fetchInitial && !response && !loading && url) {
      getOptions({ ...params });
      setData({ options: [], isFetching: true, isInitialFetched: true });
    }
  }, [fetchInitial, params]);

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
  }, [isFetchInitial, response, optionParser, onSelect, setFirstOptionSelected, setOption]);

  useEffect(() => {
    setTimeout(() => {
      fixAutoComplete();
    }, 1000);
  }, []);

  useEffect(() => {
    if (initialValue) setSelectTitle([initialValue]);
    setData({
      options: (selectedValue && !isEmpty(selectedValue) && [selectedValue])
      || (initialValue && !isEmpty(initialValue) && [initialValue]) || [],
      isInitialFetched: false,
      isFetching: false,
    });
  }, [initialValue]);

  useEffect(() => {
    if ((response && response.length) || (response?.result?.length)) {
      setOption(response);
    } else if (url) {
      let tempOptions = [];
      if (!searchValue) {
        tempOptions = (selectedValue && !isEmpty(selectedValue) && [selectedValue])
        || (initialValue && !isEmpty(initialValue) && [initialValue]) || [];
      }
      setData({
        options: tempOptions,
        isFetching: false,
        isInitialFetched: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    if (!searchValue) {
      const optionsData = (selectedValue && !isEmpty(selectedValue) && [selectedValue])
        || (initialValue && !isEmpty(initialValue) && [initialValue]) || [];
      if (optionsData?.length) {
        setData({
          options: optionsData,
          isFetching: false,
          isInitialFetched: true,
        });
      } else {
        setOption();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    if (defaultOptions) {
      let parsed = [];
      if (isArray(defaultOptions)) {
        parsed = defaultOptions;
      } else if (isObject(defaultOptions)) {
        parsed = get(defaultOptions, 'result', []);
      }
      setData({
        options: (parsed.map((item) => optionParser(item))) || [],
        isFetching: false,
        isInitialFetched: true,
      });
    }
  }, [defaultOptions]);

  const onCustomSelect = useCallback((_value, allItems) => {
    const { item } = allItems || {};
    if (typeof onSelect === 'function') {
      onSelect(item || allItems, name);
    }
    setSelectedValue(item);
    setSelectTitle();
  }, [name, onSelect, setSelectTitle, setSelectedValue]);

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

  const onCustomBlur = useCallback(() => {
    setData({ options, isFetching: false, isInitialFetched: false });
    onBlur();
  }, [onBlur, setData, options]);

  const handleEnterPress = useCallback((e) => {
    if (e.key === 'Enter') {
      if (!options || !options?.length) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, [options]);

  const reset = useCallback(() => {
    setSelectedValue();
    setData({
      options: (initialValue && !isEmpty(initialValue) && [initialValue]) || [],
      isInitialFetched: false,
      isFetching: false,
    });
  }, [initialValue, setSelectedValue]);

  useEffect(() => {
    Events.on(`resetForm-${Array.isArray(name) ? name[0] : name}`, `resetForm-grid-${Array.isArray(name) ? name.join('') : name}`, reset);
    return () => Events.remove(`resetForm-${Array.isArray(name) ? name[0] : name}`, `resetForm-grid-${Array.isArray(name) ? name.join('') : name}`);
  });
  const select = (
    <Select
      ref={selectRef}
      placeholder={placeholder}
      // searchValue={searchValue}  Commented due to reported issue in AE-2348
      onSearch={fetchData}
      filterOption={false}
      showSearch
      notFoundContent={getNoContent()}
      // onChange={handleOnChange}
      onSelect={onCustomSelect}
      onBlur={onCustomBlur}
      disabled={disabled}
      showArrow={showArrow}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      data-testid={dataTestId}
      value={value}
      allowClear={allowClear}
      onInputKeyDown={handleEnterPress}
      dropdownRender={(menu) => (
        <div className="grid-complete-search">
          {header && optionHeaderRenderer(options, columns)}
          {/* <Scrollbars style={{ width: 'auto', maxHeight: '256px' }}> */}
          {menu}
          {/* </Scrollbars> */}
        </div>
      )}
      // getPopupContainer={(trigger) => trigger?.parentNode}
      {...selectProps}
    >
      <>
        {options && options.map((item) => (
          <Select.Option
            key={item.id}
            item={item}
            value={item.value}
            name={item.name}
            className="ant-select-item-option-grouped"
          >
            {optionRenderer(item, columns)}
          </Select.Option>
        ))}
        {showTotalCount && options?.length && (
        <span className="search-footer">
          Total Count:
          <span className="mr-lt-5">{options.length}</span>
        </span>
        )}
      </>
    </Select>
  );

  useEffect(() => {
    if (resetOnParamChange) {
      setData({
        options: (initialValue && !isEmpty(initialValue) && [initialValue]) || [],
        isFetching: false,
        isInitialFetched: false,
      });
      if (onSelect) {
        onSelect(null, { item: {} });
      }
      clearSelectedValue();
    }
  }, [resetOnParamChange, params]);

  return (
    <div className={classNames('custom-autocomplete replace-search-arrow', className)} data-testid="GridAutoComplete">
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
            ) : (
              select
            )}
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
  url: null,
  onSelect: null,
  disabled: false,
  optionMaster: '',
  dropdownMatchSelectWidth: false,
  minCharLength: 3,
  allowClearOnSelect: false,
  className: '',
  initialValue: null,
  notFoundContent: 'Not Found',
  isFormItem: true,
  value: undefined,
  header: true,
  onBlur: () => { /* This is intentional */ },
  showTotalCount: false,
  allowClear: false,
  tooltipKey: '',
  onSearchTextChange: () => { /* This is intentional */ },
  customInnerTextKey: '',
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
  isFormItem: PropTypes.bool,
  value: PropTypes.instanceOf(Object),
  onBlur: PropTypes.func,
  header: PropTypes.bool,
  showTotalCount: PropTypes.bool,
  allowClear: PropTypes.bool,
  tooltipKey: PropTypes.string,
  onSearchTextChange: PropTypes.func,
  customInnerTextKey: PropTypes.string,
};

export default AutoComplete;
