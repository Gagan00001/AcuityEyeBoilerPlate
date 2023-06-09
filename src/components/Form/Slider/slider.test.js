/* eslint-disable no-undef */
import React from 'react';
import { Form as AntdForm } from 'antd';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';

import WithAppWrapper from '../../../hoc/withAppWrapper';

import Slider from '.';
import Form from '../index';

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

const sliderProps = {
  name: 'slider',
  className: '',
  label: 'Slider Test',
  labelSpan: '8',
  inputSpan: '16',
  required: true,
  id: 'test-slider',
  key: 'test-slider',
  labelAfter: false,
  children: null,
  onChange: jest.fn(),
  min: 0,
  max: 25,
  defaultValue: 0,
  step: 5,
};

const RenderSliderComponent = (props) => {
  const [form] = AntdForm.useForm();
  return (
    <Form form={form}>
      <Slider
        {...props}
      />
    </Form>
  );
};

describe('slider test cases', () => {
  const WrappedSliderComponent = WithAppWrapper(RenderSliderComponent);
  test('should match slider snapshot', () => {
    const { container: componentContainer } = render(<WrappedSliderComponent
      {...sliderProps}
    />, container);
    expect(componentContainer).toMatchSnapshot();
  });

  test('should render slider', () => {
    const { getByRole } = render(<WrappedSliderComponent
      {...sliderProps}
    />, container);
    const slider = getByRole('slider');
    expect(slider).toBeInTheDocument();
  });
});
