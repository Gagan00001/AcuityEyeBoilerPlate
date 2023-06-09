import React from 'react';
import { Spin } from 'antd';
import './widgetLoader.scss';

const WidgetLoader = ({ size }) => (
  <div className="custom-widget-loader" data-testid="customWidgetLoader">
    <Spin size={size} />
  </div>
);

export default WidgetLoader;

WidgetLoader.defaultProps = {
  size: 'large',
};
