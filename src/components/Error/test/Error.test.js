import React from 'react';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import Error from '..';

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

const messages = ['Hi this is error.', 'How are you?'];
const RenderErrorComponent = (props) => (<Error {...props} />);

describe('Error component testing', () => {
  test('should match snapshot with message.', () => {
    const { container: errorContainer } = render(
      <RenderErrorComponent messages="Hii I am error" />, container,
    );
    expect(errorContainer).toMatchSnapshot();
  });
  test('should match snapshot with multiple messages.', () => {
    const { container: errorContainer } = render(
      <RenderErrorComponent messages={messages} />, container,
    );
    expect(errorContainer).toMatchSnapshot();
  });
  test('should match snapshot with no messages.', () => {
    const { container: errorContainer } = render(
      <RenderErrorComponent />, container,
    );
    expect(errorContainer).toMatchSnapshot();
  });
});
