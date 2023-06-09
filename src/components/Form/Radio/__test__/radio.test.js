/* eslint-disable no-undef */
import React from 'react';
import { Form as AntdForm } from 'antd';
import { render, unmountComponentAtNode } from 'react-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WithAppWrapper from '../../../../hoc/withAppWrapper';

import Radio from '..';
import Form from '../..';

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

const radioProps = {
  name: 'radio-testing',
  label: 'radio-testing',
  options: [
    { label: 'Product', value: 'product' },
    { label: 'Patient', value: 'patient' },
  ],
  required: true,
};

const RenderRadioComponent = (props) => {
  const [form] = AntdForm.useForm();
  return (
    <Form form={form}>
      <Radio
        {...props}
      />
    </Form>
  );
};

test('should render radio with two options.', () => {
  const WrappedRadioComponent = WithAppWrapper(RenderRadioComponent);
  render(<WrappedRadioComponent {...radioProps} />, container);
  expect(container.getElementsByClassName('ant-radio-group').length).toBeGreaterThan(0);
});

test('should be able to select an option', () => {
  const WrappedRadioComponent = WithAppWrapper(RenderRadioComponent);
  render(<WrappedRadioComponent {...radioProps} />, container);

  const radioOption1 = screen.getByTestId('product');
  userEvent.click(radioOption1);
  expect(radioOption1.value).toBe('product');

  const radioOption2 = screen.getByTestId('patient');
  userEvent.click(radioOption2);
  expect(radioOption2.value).toBe('patient');
});

test('should render radio with different props.', () => {
  const WrappedRadioComponent = WithAppWrapper(RenderRadioComponent);
  render(<WrappedRadioComponent {...radioProps} isFormItem={false} required={false} />, container);
  expect(container).toBeInTheDocument();
});
