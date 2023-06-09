/* eslint-disable no-undef */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { Form as AntdForm } from 'antd';
import userEvent from '@testing-library/user-event';
import Input from '../index';
import Form from '../../index';
import WithAppWrapper from '../../../../hoc/withAppWrapper';

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const RenderInputComponent = (props) => {
  const [form] = AntdForm.useForm();
  return (
    <Form form={form}>
      <Input
        {...props}
      />
    </Form>
  );
};

const otherProps = {
  rules: [],
  labelSpan: 8,
  inputSpan: 16,
  disabled: false,
  maxValueLength: 20,
  minValueLength: 1,
  onClick: jest.fn(),
  className: '',
  placeholder: 'Test Input',
  autoSize: {},
  inputProps: {},
  onChange: jest.fn(),
  onBlur: jest.fn(),
  alphaNumericOnly: true,
  numberOnlyWithSign: true,
  numberOnlySignValidator: jest.fn(),
  alphaNumericValidator: jest.fn(),
  decimalPlaces: 1,
  updatePassword: true,
  numberWithHyphen: true,
  charOnly: true,
  type: 'password',
  applyValidation: true,
};

describe('should match input form item snapshot', () => {
  const WrappedRadioComponent = WithAppWrapper(RenderInputComponent);
  test('should match snapshot', () => {
    const { container: inputContainer } = render(<WrappedRadioComponent
      {...otherProps}
      label="Test Input"
      name="testInput"
      id="test-input"
      dataTestId="test-input"
    />, container);
    expect(inputContainer).toMatchSnapshot();
  });

  test('should match input snapshot without form item', () => {
    const { container: inputContainer } = render(<WrappedRadioComponent
      {...otherProps}
      label="Test Input"
      name="testInput"
      id="test-input"
      dataTestId="test-input"
      isFormItem={false}
    />, container);
    expect(inputContainer).toMatchSnapshot();
  });

  test('should render input', () => {
    const {
      getByTestId,
    } = render(<WrappedRadioComponent
      label="Test Input"
      name="testInput"
      id="test-input"
      dataTestId="test-input"
    />, container);
    expect(getByTestId('test-input')).toBeInTheDocument();
  });

  test('should be required when passed required', () => {
    render(<WrappedRadioComponent
      label="Test Input"
      name="testInput"
      required
      id="test-input"
      dataTestId="test-input"
    />, container);
    expect(document.querySelector('.ant-form-item-required')).toBeInTheDocument();
  });

  test('should be able to change value', () => {
    const {
      getByTestId,
    } = render(<WrappedRadioComponent
      label="Test Input"
      name="testInput"
      required
      id="test-input"
      dataTestId="test-input"
    />, container);
    const input = getByTestId('test-input');
    userEvent.click(input);
    fireEvent.change(input, { target: { value: 'testing input value' } });
    expect(input.value).toEqual('testing input value');
  });

  test('should be able to clear value', () => {
    const {
      getByTestId,
    } = render(<WrappedRadioComponent
      label="Test Input"
      name="testInput"
      required
      id="test-input"
      dataTestId="test-input"
    />, container);
    const input = getByTestId('test-input');
    userEvent.click(input);
    fireEvent.change(input, { target: { value: 'testing input value' } });
    expect(input.value).toEqual('testing input value');
    userEvent.click(input);
    userEvent.clear(input);
    expect(input.value).toEqual('');
  });

  test('should be able to type number only', () => {
    const {
      getByTestId,
    } = render(<WrappedRadioComponent
      label="Test Input"
      name="testInput"
      required
      id="test-input"
      dataTestId="test-input"
      alphaNumericOnly={false}
      numberOnlyWithSign={false}
      numberOnly
      decimalPlaces={1}
    />, container);
    const input = getByTestId('test-input');
    userEvent.click(input);
    fireEvent.blur(input, { target: { value: undefined } });
    userEvent.type(input, 'testing input value 1234');
    userEvent.click(input);
    expect(input.value?.trim()).toEqual('1234');
  });

  test('should be able to type special characters', () => {
    const {
      getByTestId,
    } = render(<WrappedRadioComponent
      label="Test Input"
      name="testInput"
      required
      id="test-input"
      dataTestId="test-input"
      alphaNumericOnly={false}
      numberOnlyWithSign={false}
      numbersAndSpecialChars
    />, container);
    const input = getByTestId('test-input');
    userEvent.click(input);
    userEvent.type(input, '1234#');
    expect(input.value?.trim()).toEqual('1234#');
  });
});
