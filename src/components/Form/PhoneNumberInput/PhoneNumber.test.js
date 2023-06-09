/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhoneNumberInput from '.';

describe('PhoneNumberInput', () => {
  test('renders label', () => {
    render(<PhoneNumberInput label="Phone Number" />);
    const labelElement = screen.getByText(/phone number/i);
    expect(labelElement).toBeInTheDocument();
  });

  test('renders input element', () => {
    render(<PhoneNumberInput />);
    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement).toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const handleChange = jest.fn();
    render(<PhoneNumberInput onChange={handleChange} />);
    const inputElement = screen.getByRole('spinbutton');
    fireEvent.change(inputElement, { target: { value: 1234567890 } });
    expect(handleChange).toHaveBeenCalledWith(1234567890);
  });

  test('disables input when disabled prop is true', () => {
    render(<PhoneNumberInput disabled />);
    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement).toBeDisabled();
  });
});
