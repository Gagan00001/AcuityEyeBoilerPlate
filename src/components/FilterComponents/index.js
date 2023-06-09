import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Search from './Search';
import Date from './Date';
import Recently from './Recently';
import SelectBox from './SelectBox';
import FilterButton from './FilterButton';
import BooleanSelect from './BooleanSelect';
import Checkbox from './Checkbox';
import EnumSelect from '../../wiredComponents/Enum/Select';

import './FilterComponents.scss';

const ComponentMap = {
  search: Search,
  date: Date,
  recent: Recently,
  select: SelectBox,
  filterButton: FilterButton,
  booleanSelect: BooleanSelect,
  enumSelect: (props) => <EnumSelect component={SelectBox} {...props} />,
  checkbox: Checkbox,
};

const FilterComponents = (list) => ({
  onFilterChange, filters, className, children, allowClear,
}) => (
  <div className={classNames('filter-components', className)}>
    {
    list.map((item, index) => {
      if (ComponentMap[item.type]) {
        const { type } = item;
        const FilterComponent = ComponentMap[type];
        return (
          <FilterComponent
            id={`${item.name}${index}`}
            onChange={onFilterChange}
            value={filters[item.filterProps.name] || null}
            filters={filters}
            {...item.filterProps}
          />
        );
      }
      if (item.component) {
        const Component = item.component;
        return (
          <Component
            onChange={onFilterChange}
            value={filters[item.filterProps.name] || null}
          />
        );
      }
      return null;
    })
  }
    {allowClear && <div role="presentation" onClick={() => onFilterChange({}, true)} className="clr-btn">Clear</div>}
    {children}
  </div>
);

FilterComponents.defaultProps = {
  onFilterChange: () => { /* This is intentional */ },
  filters: {},
  className: '',
  allowClear: false,
};

FilterComponents.propTypes = {
  onFilterChange: PropTypes.func,
  filters: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  allowClear: PropTypes.bool,
};

export default FilterComponents;
