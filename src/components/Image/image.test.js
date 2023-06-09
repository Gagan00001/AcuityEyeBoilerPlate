/* eslint-disable no-undef */
// IntelligentDx
// Created: 4/4/2023
// Updated: 4/4/2023
// Purpose: Unit tests for the Image component

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Image from './index';

describe('Image Component', () => {
  test('renders image with name and alt text', () => {
    render(<Image name="test-image.jpg" alt="Test Image" />);

    const imgElement = screen.getByAltText('Test Image');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', `${process.env.PUBLIC_URL}/images/test-image.jpg`);
  });

  test('renders image with url and alt text', () => {
    const testImageUrl = 'https://example.com/test-image.jpg';
    render(<Image url={testImageUrl} alt="Test Image with URL" />);

    const imgElement = screen.getByAltText('Test Image with URL');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testImageUrl);
  });

  test('renders image with additional props', () => {
    render(<Image name="test-image.jpg" alt="Test Image" className="custom-class" data-testid="custom-image" />);

    const imgElement = screen.getByTestId('custom-image');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveClass('custom-class');
    expect(imgElement).toHaveAttribute('data-testid', 'custom-image');
  });
});

