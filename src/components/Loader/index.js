import React from 'react';
import { Spin } from 'antd';
import './loader.scss';

export default function Loader({ position, style }) {
  return (
    <div className="custom-loader" data-testid="customLoader" style={{ ...style, position }}>
      <Spin />
    </div>
  );
}

Loader.defaultProps = {
  position: 'fixed',
  style: {},
};
