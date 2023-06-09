# Filter Component

It takes the list of filter and render those filter on the UI.

## Arguments


- `list` (array) - we can pass a array containing list of filter component required

    > `type` (string) - Which type of filter is required

    > `filterProps` (object) - It contains all the props that will pass to filter like `name`, `placeholder`

## Props

- `filters` (object) - It takes initialFilters value that can be displayed on a component initially

- `onFilterChange` (function) - Function that called whenever a filter is changed with the changed filter only

- `className` (string) - Custom class name that can be used to override the css

## Render

- It render all the filter components that is specified in the list

## Filter Component Types

> search - Renders a input field with search icon.

> select - Renders a dropdown.

> filterButton - Renders a button which enable or disable the filter.
