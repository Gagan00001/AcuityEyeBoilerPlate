/* eslint-disable no-undef */
import React from 'react';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import LabelInput from '../index';

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

const labelProps = {
  required: true,
};
const RenderLabelInput = (props) => (<LabelInput {...labelProps} {...props} />);

describe('should match error snapshot', () => {
  test('should match snapshot', () => {
    const { container: labelContainer } = render(
      <RenderLabelInput />, container,
    );
    expect(labelContainer).toMatchSnapshot();
  });
});
