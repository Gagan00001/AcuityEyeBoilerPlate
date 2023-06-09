/* eslint-disable no-undef */
// IntelligentDx
// Created: 5/4/2023
// Updated: 5/4/2023
// Purpose: Unit tests for the Notification component

import { notification } from 'antd';
import Notification from './index';

jest.mock('antd', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Notification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays a success notification', () => {
    const message = 'Success message';
    Notification({ message, success: true });

    expect(notification.success).toHaveBeenCalledWith({
      message: 'SUCCESS',
      description: message,
      duration: 4.5,
    });
    expect(notification.error).not.toHaveBeenCalled();
  });

  it('displays an error notification', () => {
    const message = 'Error message';
    Notification({ message, success: false });

    expect(notification.error).toHaveBeenCalledWith({
      message: 'ERROR',
      description: message,
      duration: 4.5,
    });
    expect(notification.success).not.toHaveBeenCalled();
  });
});
