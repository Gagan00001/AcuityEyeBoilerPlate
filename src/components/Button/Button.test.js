/* eslint-disable no-undef */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Button from './index';

describe('Check if button Component renders and calls function onClick', () => {
  test('renders without crashing', () => {
    const { getByTestId } = render(<Button className="lt-arrow" />);
    expect(getByTestId('commonBtn')).toBeInTheDocument();
  });

  test('Checks Given classNames', () => {
    const { getByTestId } = render(<Button className="lt-arrow" />);
    expect(getByTestId('commonBtn')).toHaveClass('lt-arrow');
  });

  test('Checks Button Type', () => {
    const { getByTestId } = render(<Button type="submit" />);
    expect(getByTestId('commonBtn')).toHaveProperty('type', 'submit');
  });

  test('check if child renders', () => {
    const { getByTestId } = render(<Button type="submit">Click Here</Button>);
    expect(getByTestId('commonBtn')).toHaveTextContent('Click Here');
  });

  test('check if function gets call onClick', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(<Button onClick={handleClick}>Click Here</Button>);
    fireEvent.click(getByTestId('commonBtn'));
    expect(handleClick).toHaveBeenCalled();
  });
});
