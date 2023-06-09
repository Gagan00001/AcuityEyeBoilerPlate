/* eslint-disable no-undef */
// IntelligentDx
// Created: 4/4/2023
// Updated: 4/4/2023
// Purpose: Unit tests for the Loader component

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Loader from './index';

describe('Loader', () => {
  it('renders the Loader component with default props', () => {
    render(<Loader />);

    const loaderElement = screen.getByTestId('customLoader');
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveStyle({ position: 'fixed' });
  });

  it('renders the Loader component with custom props', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<Loader position="absolute" style={customStyle} />);

    const loaderElement = screen.getByTestId('customLoader');
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveStyle({ position: 'absolute', backgroundColor: 'red' });
  });

  it('contains the Spin component', () => {
    const { container } = render(<Loader />);
    const spinElement = container.querySelector('.ant-spin');
    expect(spinElement).toBeInTheDocument();
  });

  it('renders the Loader component with an empty style object', () => {
    render(<Loader style={{}} />);
    const loaderElement = screen.getByTestId('customLoader');
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveStyle({ position: 'fixed' });
  });
});
