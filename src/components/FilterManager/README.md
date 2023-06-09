# Filter Manager

It manages all the filter that can we apply on a component.

## Props

- `initialFilter` (object) - It takes initialFilters that can be applied on a component initially but can be removed afterwards

- `onChange` (function) - We can pass a function that can be called whenever a filter is changed with the updated filters as an argument

## Return

- Function as a children - it returns a function which contains two parameter

    > `filters` (object) - filters which are currently being applied

    > `onFilterChange` (function) - A function which is used to update the filters
