import React from 'react';
import { Dropdown } from 'antd';

const FilterDropdown = ({ menu, ...restProps }) => (
  <div>
    <Dropdown overlay={menu} placement="bottomRight" {...restProps}>
      <a role="presentation">
        <span className="filter-icon" />
      </a>
    </Dropdown>
  </div>
);

export default FilterDropdown;

