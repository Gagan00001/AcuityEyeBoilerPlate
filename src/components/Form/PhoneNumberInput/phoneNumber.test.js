import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PhoneNumberInput from './index';

describe('PhoneNumberInput', () => {
  test('renders PhoneNumberInput component', () => {
    render(<PhoneNumberInput />);
  });

  test('should call onChange when input changes', () => {
    const mockOnChange = jest.fn();
    render(<PhoneNumberInput onChange={mockOnChange} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '1234567890' } });
    expect(mockOnChange).toHaveBeenCalledWith(1234567890);
  });
});
