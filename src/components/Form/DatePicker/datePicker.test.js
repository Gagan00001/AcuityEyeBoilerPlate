import React from 'react';
import moment from 'moment';
import {
  act, fireEvent, screen, waitFor,
} from '@testing-library/react';
import { Form as AntdForm } from 'antd';
import { render, unmountComponentAtNode } from 'react-dom';
import userEvent from '@testing-library/user-event';
import DatePicker from './index';
import Form from '../index';
import WithAppWrapper from '../../../hoc/withAppWrapper';

let container = null;
// eslint-disable-next-line no-undef
beforeEach(() => {
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
  label: 'Date-Form',
  name: 'date',
  required: true,
  showTime: false,
  rules: [],
  value: '',
  className: '',
  allowClear: true,
  disabled: false,
  dataTestId: 'date-picker',
  shouldShowWarningText: false,
};

let form;

const RenderComponent = (props) => {
  form = AntdForm.useForm();
  return (
    <Form form={form[0]}>
      <DatePicker
        {...defaultProps}
        {...props}
      />
    </Form>
  );
};

// eslint-disable-next-line no-undef
test('should be able to select and clear date picker form component.', () => {
  const WrappedDateComponent = WithAppWrapper(RenderComponent);
  act(() => {
    render(
      <WrappedDateComponent />,
      container,
    );
  });
  const datePickerInput = screen.getByTestId('date-picker');
  userEvent.click(datePickerInput);
  // eslint-disable-next-line no-undef
  expect(datePickerInput).toHaveFocus();
  fireEvent.click(screen.getByTitle(moment().add(2, 'days').format('YYYY-MM-DD')));
  // eslint-disable-next-line no-undef
  expect(datePickerInput.value).toBeDefined();
  // eslint-disable-next-line no-undef
  expect(container.getElementsByClassName('ant-picker-clear').length).toBe(1);
  const crossIcon = document.querySelector('.ant-picker-clear');
  fireEvent.mouseDown(crossIcon);
  fireEvent.mouseUp(crossIcon);
  // eslint-disable-next-line no-undef
  expect(container.getElementsByClassName('ant-picker-clear').length).toBe(0);
  // eslint-disable-next-line no-undef
  expect(datePickerInput.value).toBe('');
});

// eslint-disable-next-line no-undef
test('should show error validation message on form submit.', async () => {
  const WrappedDateComponent = WithAppWrapper(RenderComponent);
  act(() => {
    render(
      <WrappedDateComponent shouldShowWarningText />,
      container,
    );
  });
  form[0].submit();
  const data = await waitFor(() => screen.getByText('Date-Form is required'));
  // eslint-disable-next-line no-undef
  expect(data).toBeInTheDocument();
});
