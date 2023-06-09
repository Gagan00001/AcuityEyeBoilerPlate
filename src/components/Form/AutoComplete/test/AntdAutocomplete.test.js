/* eslint-disable no-undef */
import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { Form as AntdForm } from 'antd';

import { apiUrls } from '../../../../api/constants';

import WithAppWrapper from '../../../../hoc/withAppWrapper';
import Form from '../../index';
import AntdAutocomplete from '../AntdAutocomplete';

let container = null;

// eslint-disable-next-line no-undef
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

// eslint-disable-next-line no-undef
afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const defaultProps = {
  label: 'Provider',
  name: 'providerId',
  id: 'provider',
  labelSpan: '8',
  inputSpan: '16',
  url: apiUrls.GET_PROVIDERS,
  optionParser: (option) => ({
    name: option.providerName,
    value: option.providerName,
    item: option,
    ...option,
  }),
  optionMaster: 'searchText',
  debounceDuration: 0,
  dataTestId: 'provider-autoComplete',
};

const RenderComponent = () => {
  const [form] = AntdForm.useForm();
  return (
    <Form form={form}>
      <AntdAutocomplete {...defaultProps} />
    </Form>
  );
};

test('should render autoComplete component', () => {
  const WrappedAutoSelectComponent = WithAppWrapper(RenderComponent);
  act(() => {
    render(<WrappedAutoSelectComponent />, container);
  });
  const autoCompleteInput = screen.getByTestId('provider-autoComplete');
  expect(autoCompleteInput).toBeInTheDocument();
});

test('should be able to search and select value from dropDown list after API call', async () => {
  const WrappedAutoSelectComponent = WithAppWrapper(RenderComponent);
  act(() => {
    render(<WrappedAutoSelectComponent />, container);
  });
  const autoCompleteSelect = screen.getByTestId('provider-autoComplete').querySelector('.ant-select-selection-search-input');
  userEvent.type(autoCompleteSelect, 'provider');
  expect(autoCompleteSelect.value).toBe('provider');
  await waitFor(() => screen.getByTitle('AJ Provider'), { timeout: 1500 });
  fireEvent.click(screen.getByTitle('AJ Provider'));
  expect(autoCompleteSelect.value).toBe('AJ Provider');
});
