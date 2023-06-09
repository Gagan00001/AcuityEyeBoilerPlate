import React from 'react';
import { render, screen } from '@testing-library/react';
import WidgetLoader from '..';

describe('WidgetLoader', () => {
  it('renders the WidgetLoader component with default size prop', () => {
    render(<WidgetLoader />);

    const widgetLoader = screen.getByTestId('customWidgetLoader');
    const spinComponent = widgetLoader.querySelector('.ant-spin');

    expect(widgetLoader).toBeInTheDocument();
    expect(spinComponent).toBeInTheDocument();
    expect(spinComponent).toHaveClass('ant-spin-lg');
  });

  it('renders the WidgetLoader component with a custom size prop', () => {
    render(<WidgetLoader size="small" />);

    const widgetLoader = screen.getByTestId('customWidgetLoader');
    const spinComponent = widgetLoader.querySelector('.ant-spin');

    expect(spinComponent).toHaveClass('ant-spin-sm');
  });
});
