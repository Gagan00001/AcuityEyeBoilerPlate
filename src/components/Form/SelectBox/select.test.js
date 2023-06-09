/* eslint-disable no-undef */
import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { Form as AntdForm } from 'antd';

import WithAppWrapper from '../../../hoc/withAppWrapper';
import Form from '../index';
import Select from './index';

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
  label: 'Country',
  name: 'countryId',
  labelSpan: '8',
  inputSpan: '16',
  required: true,
  options: [
    {
      name: 'India',
      value: 1,
    },
    {
      name: 'USA',
      value: 2,
    },
  ],
};
let form;
const RenderComponent = () => {
  form = AntdForm.useForm();
  return (
    <Form form={form[0]}>
      <Select
        {...defaultProps}
      />

    </Form>
  );
};

test('should render select component', () => {
  const WrappedCustomSelectComponent = WithAppWrapper(RenderComponent);
  act(() => {
    render(<WrappedCustomSelectComponent />, container);
  });
  const selectInput = screen.getByTestId('countryId');
  expect(selectInput).toBeInTheDocument();
});

test('should be able to select option', async () => {
  const WrappedCustomSelectComponent = WithAppWrapper(RenderComponent);
  act(() => {
    render(<WrappedCustomSelectComponent />, container);
  });
  const selectSelect = screen.getByTestId('countryId').querySelector('.ant-select-selection-search-input');
  userEvent.click(selectSelect);
  await waitFor(() => screen.getByTitle('India').querySelector('.ant-select-item-option-content'), { timeout: 1500 });
  fireEvent.click(screen.getByText('India'));
  const selectedValue = screen.getByTestId('countryId').querySelector('.ant-select-selection-item');
  expect(selectedValue).toHaveTextContent('India');
});
