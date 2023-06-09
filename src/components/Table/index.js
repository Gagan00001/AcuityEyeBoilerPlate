import React, {
  useEffect, useRef, useCallback,
  forwardRef, useState, useLayoutEffect,
  useMemo, useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import {
  useTable,
  useSortBy,
  useExpanded,
  useRowSelect,
  usePagination,
} from 'react-table';
import InfiniteScroll from 'react-infinite-scroll-component';
import classNames from 'classnames';
import {
  Spin, Tooltip, Dropdown, Affix,
} from 'antd';
import throttle from 'lodash/throttle';
import isFunction from 'lodash/isFunction';

import Spinner from '../Spinner';
import { makeTableResizable } from './resizable';
import './table.scss';
import CheckBox from '../SmCheckbox';
import Input from '../Input';

import WithTableWrapper from '../../hoc/withTableWrapper';

const { REACT_APP_FAKE } = process.env;

const TableColumn = forwardRef(({ tdClassName, cell }, ref) => (
  <td ref={ref} className={classNames(tdClassName, 'table-data', cell?.column?.className)} {...cell.getCellProps()}>
    {cell.render('Cell')}
  </td>
));

TableColumn.defaultProps = {
  tdClassName: '',
  cell: {},
};

TableColumn.propTypes = {
  tdClassName: PropTypes.string,
  cell: PropTypes.instanceOf(Object),
};

const TableRow = ({
  row,
  onRowClick,
  tdClassName,
  rowClickable,
  clickableIndex,
  rowClassName,
  tooltip,
  tooltipTitleHandler,
  rightClickMenu,
  onCustomRowClick,
  isDroppable,
  isRowClickable,
  rowIndex,
  dataTestId,
}) => {
  const ref = useRef(null);
  const customOnRowClick = useCallback((event) => {
    event.preventDefault();
    if (onCustomRowClick && onCustomRowClick(row)) {
      onCustomRowClick(row)();
    } else if (ref.current.children[0] && ref.current.children[0].click && isRowClickable) {
      ref.current.children[0].click();
    }
    if (onRowClick) onRowClick(row);
  }, [onCustomRowClick, row, isRowClickable, onRowClick]);

  const [, drag] = useDrag({
    item: {
      type: 'table-row',
      id: row?.id || rowIndex,
      data: row?.original,
    },
    canDrag: isDroppable,
  });

  const titleHandler = useCallback(tooltipTitleHandler(row.original), [tooltipTitleHandler]);
  const tableRow = (
    <tr ref={drag} data-testid={dataTestId} onClick={customOnRowClick} className={classNames(rowClassName, { 'cursor-pointer': rowClickable })}>
      {row.cells.map((cell, index) => (
        index === clickableIndex ? <TableColumn ref={ref} tdClassName={tdClassName} cell={cell} />
          : <TableColumn tdClassName={tdClassName} cell={cell} />))}
    </tr>
  );

  if (tooltip) {
    return (
      <Tooltip title={titleHandler}>
        {tableRow}
      </Tooltip>
    );
  }

  if (rightClickMenu) {
    return (
      <Dropdown overlay={rightClickMenu(row)} placement="bottomLeft" trigger={['contextMenu']}>
        {tableRow}
      </Dropdown>

    );
  }

  return tableRow;
};

TableRow.defaultProps = {
  row: {},
  onRowClick: null,
  tdClassName: '',
  rowClickable: false,
  clickableIndex: 0,
  tooltip: false,
  tooltipTitleHandler: () => { /* This is intentional */ },
  rightClickMenu: null,
};

TableRow.propTypes = {
  row: PropTypes.instanceOf(Object),
  onRowClick: PropTypes.func,
  tdClassName: PropTypes.string,
  rowClickable: PropTypes.bool,
  clickableIndex: PropTypes.number,
  tooltip: PropTypes.bool,
  tooltipTitleHandler: PropTypes.func,
  rightClickMenu: PropTypes.func,
};

function Table({
  columns,
  data,
  thClassName,
  tdClassName,
  footer,
  hasMore,
  onFetchMore,
  filters,
  loading,
  onSort,
  initialSort,
  noDataText,
  renderRowSubComponent,
  onRowClick,
  rowClickable,
  clickableIndex,
  selectedRows,
  disabledRows,
  children,
  showNoDataText,
  rowClassName,
  headerClassName,
  tooltip,
  tooltipTitleHandler,
  scrollId,
  showRowSelection,
  setSelectedRow,
  rightClickMenu,
  checkedRowIds,
  handleRightClickOptionClicked,
  onCustomRowClick,
  isHeaderFixed,
  customData,
  isDroppable,
  isRowClickable,
  skipInitialFetch,
  hiddenColumns,
  disableTable,
  dataTestId,
  rowSelectionRef,
  isPagination,
  rowSelectionOnDropdown,
  setIsRowSelectionOnDropdownSelected,
  isRowSelectionOnDropdownSelected,
  ...otherProps
}) {
  // Use the state and functions returned from useTable to build your UI
  const [ids, setIds] = useState({});

  const selectAllMethod = useCallback(({ onChange }) => {
    onChange({ target: { checked: !isRowSelectionOnDropdownSelected } });
    if (isFunction(setIsRowSelectionOnDropdownSelected)) {
      setIsRowSelectionOnDropdownSelected(!isRowSelectionOnDropdownSelected);
    }
  }, [isRowSelectionOnDropdownSelected, setIsRowSelectionOnDropdownSelected]);

  const selectParentCheckBox = useCallback(({ onChange }) => (event) => {
    onChange(event);
    if (isFunction(setIsRowSelectionOnDropdownSelected)) {
      setIsRowSelectionOnDropdownSelected(!event?.target?.checked);
    }
  }, [setIsRowSelectionOnDropdownSelected]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    footerGroups,
    prepareRow,
    visibleColumns,
    selectedFlatRows,
    state: { sortBy, selectedRowIds },
    toggleAllRowsSelected,
    pageOptions,
    pageCount,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      manualSortBy: !REACT_APP_FAKE,
      initialState: {
        sortBy: initialSort,
        selectedRowIds: setSelectedRow ? checkedRowIds : ids,
        hiddenColumns,
        pageIndex: 0,
      },
      selectedRows,
      disabledRows,
      customData,
      ...otherProps,
    },
    useSortBy,
    useExpanded,
    useRowSelect,
    usePagination,
    (hooks) => {
      if (showRowSelection) {
        hooks.visibleColumns.push((tableColumns) => [
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <>
                {!rowSelectionOnDropdown
                && (
                <div>
                  <CheckBox
                    {...getToggleAllRowsSelectedProps()}
                  />
                </div>
                )}
                {rowSelectionOnDropdown
                && (
                <div className="checkbox-with-arrow">
                  <CheckBox
                    {...getToggleAllRowsSelectedProps()}
                    onChange={selectParentCheckBox(getToggleAllRowsSelectedProps())}
                  />
                  <div className="select-option-dropdown">
                    <p type="button" className="arrow-down-icon" />
                    <div className="top-gap-for-header">
                      <div className="dropdown-option-box">
                        <ul>
                          <li role="presentation" onClick={() => selectAllMethod(getToggleAllRowsSelectedProps())}>Select All</li>
                          <div className="on-hover-value">
                            <p>All Claim will be selected</p>
                          </div>
                        </ul>

                      </div>
                    </div>
                  </div>

                </div>
                )}
              </>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => {
              const rowProps = row.getToggleRowSelectedProps();
              rowProps.onClick = (e) => e.stopPropagation();
              return (
                <div data-testid={`checkbox-selection-${row.id}`}>
                  <CheckBox {...rowProps} />
                </div>
              );
            },
            fixWidth: '45',
          },
          ...tableColumns,
        ]);
      }
    },
    // useFlexLayout,
    // useResizeColumns,
  );

  useImperativeHandle(rowSelectionRef, () => ({
    resetCheckBoxes: toggleAllRowsSelected,
    selectedRows: selectedFlatRows,
  }));

  const [centerLoader, setCenterLoader] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    if (setSelectedRow) setSelectedRow(selectedFlatRows);
    else setIds(selectedRowIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowIds, setSelectedRow]);

  useEffect(() => {
    columns.map((column) => {
      if (column.reverseSort && column.accessor === sortBy[0]?.id) {
        sortBy[0].reverseSort = column.reverseSort;
      }
      return true;
    });

    if (typeof onSort === 'function' && !customData) {
      onSort(sortBy, skipInitialFetch, isMounted.current);
    }
    if (!isMounted.current) {
      isMounted.current = true;
    }
    return () => { /* This is intentional */ };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const parentRef = useRef(null);
  const tableRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    // Update the document title using the browser API
    makeTableResizable(tableRef.current);
  }, [columns]);

  const columnSort = useCallback((column) => {
    let columnSorted;
    if (column.isSorted) {
      const isSorted = column.isSortedDesc ? ' ▼' : ' ▲';
      columnSorted = column.sort || column.reverseSort ? isSorted : '';
    }
    return columnSorted;
  }, []);

  useEffect(() => {
    const screenHeight = window.screen.height;
    const tableHeight = isHeaderFixed
      ? bodyRef.current.clientHeight
      : tableRef.current.clientHeight;
    if (tableHeight > screenHeight) {
      setCenterLoader(true);
    } else {
      setCenterLoader(false);
    }
  }, [data, isHeaderFixed]);

  const syncHeaderWidths = (cTHead, tTHead) => {
    if (tTHead.length && cTHead.length) {
      for (let i = 0; i < tTHead.length; i += 1) {
        const width = `${tTHead[i].offsetWidth}px`;
        if (cTHead[i]) {
          // eslint-disable-next-line no-param-reassign
          cTHead[i].style.width = width;
          // eslint-disable-next-line no-param-reassign
          cTHead[i].style.maxWidth = width;
        }
      }
    }
  };

  useLayoutEffect(() => {
    const customThead = tableRef.current?.getElementsByTagName('th') || [];
    const tableThead = bodyRef.current?.getElementsByTagName('th') || [];
    const tableSizeObserver = new ResizeObserver((entries) => {
      if (entries.length) {
        const { width } = entries[0]?.contentRect || {};
        // sync table width and thead columns with on resize
        if (width) tableRef.current.parentNode.style.width = `${width}px`;
        syncHeaderWidths(customThead, tableThead);
      }
    });
    if (isHeaderFixed) {
      tableSizeObserver.observe(bodyRef.current);
      if (customThead.length) {
        Array.from(customThead).forEach((item) => {
          item.addEventListener('resize', throttle(() => {
            syncHeaderWidths(tableThead, customThead);
          }, 100));
        });
      }
    }
    return () => tableSizeObserver?.disconnect();
  }, []);

  const TableHeader = useMemo(() => (
    <thead className={classNames(headerClassName)}>
      {headerGroups.map((headerGroup, index) => (
        <tr {...headerGroup.getHeaderGroupProps()} key={`header${index}`}>
          {headerGroup.headers.map((column, thIndex) => (
            <th
              className={classNames(column?.className ?? thClassName, 'b-right', { 'table-data': !column.fixWidth })}
              {...column.getHeaderProps(
                (column.sort || column.reverseSort) && column.getSortByToggleProps(),
              )}
              style={{ width: column.fixWidth ? `${column.fixWidth}px` : undefined }}
              // width={column.fixWidth || null}
              key={`th${thIndex}`}
            >
              <div className="table-header">
                <span>{column.render('Header')}</span>
                <span className="up-sort-arrow">
                  {columnSort(column)}
                </span>
                {!column.isSorted && (column.sort || column.reverseSort) ? (
                  <span className="both-sort-arrow">
                    <span>▲</span>
                    <span>▼</span>
                  </span>
                ) : (
                  ''
                )}
                {column.required ? (
                  <span className="req-star ant-form-item-required" />
                ) : (
                  ''
                )}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  ), [columnSort, headerClassName, headerGroups, thClassName, sortBy]);

  const handleGoToFirstPage = useCallback(() => {
    gotoPage(0);
  },
  [gotoPage]);

  const handleGoToLastPage = useCallback(() => {
    gotoPage(pageCount - 1);
  },
  [gotoPage, pageCount]);

  const handlePreviousPage = useCallback(() => {
    previousPage();
  },
  [previousPage]);

  const handleNextPage = useCallback(() => {
    nextPage();
  },
  [nextPage]);

  const handlePageSize = useCallback((e) => {
    setPageSize(Number(e.target.value));
  },
  [setPageSize]);

  const handleGoToPage = useCallback((e) => {
    const pageNo = e.target.value ? Number(e.target.value) - 1 : 0;
    gotoPage(pageNo);
  },
  [gotoPage]);

  const PaginationComponent = useCallback(() => (
    <div className="pagination custom-pagination">
      <button type="button" onClick={handleGoToFirstPage} disabled={!canPreviousPage}>
        {'<<'}
      </button>
      <button type="button" onClick={handlePreviousPage} disabled={!canPreviousPage}>
        {'<'}
      </button>
      <button type="button" onClick={handleNextPage} disabled={!canNextPage}>
        {'>'}
      </button>
      <button type="button" onClick={handleGoToLastPage} disabled={!canNextPage}>
        {'>>'}
      </button>
      <span>
        Page
        <span style={{ display: 'inlineBlock', paddingLeft: '4px', paddingRight: '4px' }}>{pageIndex + 1}</span>
        of
        <span style={{ display: 'inlineBlock', paddingLeft: '4px' }}>{pageOptions.length}</span>
      </span>
      <select
        value={pageSize}
        onChange={handlePageSize}
      >
        {[10, 20, 30, 40, 50].map((pageSizes) => (
          <option key={pageSizes} value={pageSizes}>

            {pageSizes}
            {' '}
            / page
          </option>
        ))}
      </select>
      <div className="flex flex-dir-row justify-content-center align-center">
        <span style={{ display: 'inlineBlock', paddingLeft: '4px', paddingRight: '4px' }}>Go to</span>
        <Input
          type="number"
          min={1}
          defaultValue={pageIndex + 1}
          onChange={handleGoToPage}
          style={{ width: '60px' }}
        />
        <span style={{ display: 'inlineBlock', paddingLeft: '4px' }}>page</span>
      </div>
    </div>
  ), [handleGoToFirstPage,
    canPreviousPage,
    handlePreviousPage,
    handleNextPage, canNextPage,
    handleGoToLastPage, pageIndex,
    pageOptions.length, pageSize,
    handlePageSize, handleGoToPage]);

  // Render the UI for your table
  return (
    <div className="table-container">
      {loading ? (
        <div className="loader">
          <Spin size="large" className={centerLoader && 'loader-spin'} />
        </div>
      ) : null}
      {isHeaderFixed && scrollId && (
      <div className={classNames('app-table table-in-scroll-header', { 'row-selection-table': showRowSelection })}>
        <table {...getTableProps()} ref={tableRef} style={{ backgroundColor: 'white' }}>
          {TableHeader}
        </table>
      </div>
      )}
      <div ref={parentRef} className={classNames('app-table', { 'row-selection-table': showRowSelection })} id={scrollId}>
        {isHeaderFixed && !scrollId && (
          <Affix className="affixed-table">
            <table {...getTableProps()} ref={tableRef} style={{ backgroundColor: 'white' }}>
              {TableHeader}
            </table>
          </Affix>
        )}
        <InfiniteScroll
          dataLength={rows.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={<Spinner className="spinner" />}
          scrollableTarget={scrollId}
        >
          <table
            {...getTableProps()}
            ref={isHeaderFixed ? bodyRef : tableRef}
            data-testid={dataTestId}
          >
            {TableHeader}
            <tbody {...getTableBodyProps()}>
              {!children && (isPagination ? page : rows).map((row, index) => {
                prepareRow(row);
                const disabled = disabledRows.indexOf(row.id) >= 0;
                const selected = disabled ? false : selectedRows.indexOf(row.id) >= 0;
                return (
                  <>
                    <TableRow
                      row={row}
                      onRowClick={onRowClick}
                      onCustomRowClick={onCustomRowClick}
                      tdClassName={classNames(tdClassName, {
                        'td-selected': selected,
                        'td-disabled': disabled,
                      })}
                      rowClickable={rowClickable}
                      clickableIndex={clickableIndex}
                      key={`row${index}`}
                      rowIndex={index}
                      {...row.getRowProps()}
                      rowClassName={rowClassName}
                      tooltip={tooltip}
                      tooltipTitleHandler={tooltipTitleHandler}
                      rightClickMenu={rightClickMenu}
                      handleRightClickOptionClicked={handleRightClickOptionClicked}
                      isDroppable={isDroppable}
                      isRowClickable={isRowClickable}
                      dataTestId={`table-index-${index}`}
                    />
                    {row.isExpanded ? (
                      <tr key={`rowExpanded${index}`}>
                        <td colSpan={visibleColumns.length}>
                          {renderRowSubComponent({ row })}
                        </td>
                      </tr>
                    ) : null}
                  </>
                );
              })}
              {children && children({ rows, ...otherProps })}
            </tbody>
            {
              footer && (
                <tfoot>
                  {isFunction(footer) ? footer(data) : (
                    footerGroups.map((group, index) => (
                      <tr {...group.getFooterGroupProps()} key={`tr${index}`}>
                        {group.headers.map((column, groupIndex) => (
                          <td {...column.getFooterProps()} key={`td${groupIndex}`}>
                            {column.render('Footer')}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tfoot>
              )
            }
          </table>
          {/* NOTE: React Table V7 does not provide anything for no data text */}
          {showNoDataText && !rows.length && (
            <div className="no-data-text">
              {noDataText}
            </div>
          )}
          {isPagination && page?.length ? (<PaginationComponent />) : null}
        </InfiniteScroll>
      </div>
    </div>
  );
}

Table.defaultProps = {
  initialSort: [],
  footer: false,
  noDataText: 'No Data Found',
  data: [],
  rowClickable: true,
  clickableIndex: 0,
  columns: [],
  thClassName: '',
  tdClassName: '',
  hasMore: false,
  filters: {},
  onFetchMore: () => { /* This is intentional */ },
  loading: false,
  onSort: null,
  renderRowSubComponent: null,
  onRowClick: null,
  selectedRows: [],
  disabledRows: [],
  showNoDataText: true,
  rowClassName: '',
  headerClassName: '',
  tooltip: false,
  tooltipTitleHandler: () => { /* This is intentional */ },
  scrollId: '',
  setSelectedRow: () => { /* This is intentional */ },
  showRowSelection: false,
  rightClickMenu: null,
  checkedRowIds: {},
  isHeaderFixed: true,
  isDroppable: false,
  isRowClickable: true,
  hiddenColumns: [],
  disableTable: false,
};

Table.propTypes = {
  columns: PropTypes.instanceOf(Array),
  initialSort: PropTypes.instanceOf(Array),
  footer: PropTypes.bool,
  noDataText: PropTypes.string,
  data: PropTypes.instanceOf(Array),
  rowClickable: PropTypes.bool,
  clickableIndex: PropTypes.number,
  thClassName: PropTypes.string,
  tdClassName: PropTypes.string,
  hasMore: PropTypes.bool,
  filters: PropTypes.instanceOf(Object),
  onFetchMore: PropTypes.func,
  loading: PropTypes.bool,
  onSort: PropTypes.func,
  renderRowSubComponent: PropTypes.node,
  onRowClick: PropTypes.func,
  selectedRows: PropTypes.instanceOf(Array),
  disabledRows: PropTypes.instanceOf(Array),
  showNoDataText: PropTypes.bool,
  rowClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  tooltip: PropTypes.bool,
  tooltipTitleHandler: PropTypes.func,
  scrollId: PropTypes.string,
  setSelectedRow: PropTypes.func,
  showRowSelection: PropTypes.bool,
  rightClickMenu: PropTypes.func,
  checkedRowIds: PropTypes.instanceOf(Object),
  isHeaderFixed: PropTypes.bool,
  isDroppable: PropTypes.bool,
  isRowClickable: PropTypes.bool,
  hiddenColumns: PropTypes.instanceOf(Array),
  disableTable: PropTypes.bool,
};

export default WithTableWrapper(Table);
