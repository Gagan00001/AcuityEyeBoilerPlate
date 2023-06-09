import React, { useEffect } from 'react';
import {
  render, screen, fireEvent, waitFor, waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Login from './index';
import WithAppWrapper from '../../hoc/withAppWrapper';

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

const mockNavigationFunc = jest.fn();

jest.mock('../../hooks/useRedirect', () => () => ({
  push: (to) => {
    mockNavigationFunc(to);
  },
  params: { id: 1 },
}));

const LoginPage = (props) => {
  const WrappedPatientListComponent = WithAppWrapper(
    Login,
  );

  useEffect(() => {
  /** It is used for pushing the route to support login page */
    window.history.pushState({}, '', '/support_login');
  }, []);
  return (
    <WrappedPatientListComponent {...props} />
  );
};

const handleLogin = (user, password, getByTestId) => {
  const username = getByTestId('email');
  const secret = getByTestId('password');

  userEvent.click(username);
  fireEvent.change(username, { target: { value: user } });
  userEvent.click(secret);
  fireEvent.change(secret, { target: { value: password } });
  expect(username).toBeInTheDocument();
  expect(secret).toBeInTheDocument();
  act(() => {
    userEvent.click(getByTestId('loginBtn'));
  });
};

describe('login page test case', () => {
  test('should render login component', () => {
    render(<LoginPage />, container);
    const header = screen.getByText(/Login to Healthcare/i);
    expect(header).toBeInTheDocument();
  });

  test('should handle error for incorrect credentials', async () => {
    const { getByTestId, getByText } = render(<LoginPage />, container);
    handleLogin('error@dummy.com', '*****', getByTestId);
    await waitFor(() => getByTestId('customLoader'));
    await waitForElementToBeRemoved(() => getByTestId('customLoader'));
    await waitFor(() => getByText('Username or password is incorrect'));
    expect(getByText('Username or password is incorrect')).toBeInTheDocument();
  });

  test('should redirect provider to doctor page on login', async () => {
    const { getByTestId, rerender } = render(<LoginPage />, container);
    handleLogin('success@dummy.com', '*****', getByTestId);
    await waitFor(() => getByTestId('customLoader'));
    await waitForElementToBeRemoved(() => getByTestId('customLoader'), { timeout: 1500 });
    expect(mockNavigationFunc).toHaveBeenCalledWith('/doctor');
    rerender(<LoginPage />, container);
    expect(mockNavigationFunc).toHaveBeenCalledWith('/doctor');
  });
});
