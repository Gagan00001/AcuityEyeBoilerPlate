/* eslint-disable no-undef */
import React from 'react';
import { Form as AntdForm } from 'antd';
import { act, screen } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';
import userEvent from '@testing-library/user-event';

import WithAppWrapper from '../../../hoc/withAppWrapper';

import Form from '../index';
import Checkbox from './index';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const checkboxProps = {
  name: 'checkbox-testing',
  label: 'checkboxRender',
  valuePropName: 'checked',
  required: true,
  labelAfter: true,
};

const RenderCheckboxComponent = (props) => {
  const [form] = AntdForm.useForm();
  return (
    <Form form={form}>
      <Checkbox
        {...props}
      />
    </Form>
  );
};

test('should be able to check and uncheck checkbox form component', async () => {
  const WrappedCheckboxComponent = WithAppWrapper(RenderCheckboxComponent);
  act(() => {
    render(
      <WrappedCheckboxComponent
        {...checkboxProps}
      />,
      container,
    );
  });
  const checkbox = screen.getByTestId('checkbox-testing');
  expect(checkbox.checked).toEqual(false);
  userEvent.click(checkbox);
  expect(checkbox.checked).toEqual(true);
  userEvent.click(checkbox);
  expect(checkbox.checked).toEqual(false);
});

