import React from 'react';
import { render, screen } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import WithAppWrapper from '../../../../hoc/withAppWrapper';
import PhoneNumberInput from '..';

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

describe('PhoneNumberInput', () => {
  const props = {
    label: 'Phone Number Input',
    name: 'emergencyContactPhone',
    inputSpan: '10',
    labelSpan: '14',
    id: '1',
    onChange: jest.fn(),
    isFormItem: true,
    maxValueLength: 10,
    minValueLength: 10,
    placeholder: 'Enter Emergency Contact Phone',
  };

  const validatePhoneNumber = (phoneNumber) => {
    let errorMessage = '';

    if (phoneNumber.length > props.maxValueLength) {
      errorMessage = `${props.label} cannot be longer than ${props.maxValueLength} digits`;
    } else if (phoneNumber.length === 0 || phoneNumber.length < props.minValueLength) {
      errorMessage = `${props.label} must be at least ${props.minValueLength} digits`;
    }
    return errorMessage;
  };

  const RenderComponent = () => (
    <PhoneNumberInput {...props} />
  );

  test('should match snapshot', () => {
    const { container: Container } = render(
      <RenderComponent />, container,
    );
    expect(Container).toMatchSnapshot();
  });

  test('should render component', async () => {
    const WrapperAutoComponent = WithAppWrapper(RenderComponent);
    render(<WrapperAutoComponent />);
    const buttonList = await screen.findAllByRole('button');
    expect(buttonList).toHaveLength(2);
    expect(screen.getByRole('spinbutton')).toBeTruthy();
    expect(screen.getByText('Phone Number Input')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter Emergency Contact Phone'));
  });

  test('validate input phone number', () => {
    const WrapperAutoComponent = WithAppWrapper(RenderComponent);
    render(<WrapperAutoComponent />);
    const phoneNumber = '9712345678';

    expect(validatePhoneNumber(phoneNumber)).not.toEqual(`${props.label} cannot be longer than ${props.maxValueLength} digits`);
    expect(validatePhoneNumber(phoneNumber)).not.toEqual(`${props.label} must be at least ${props.minValueLength} digits`);
  });
});
