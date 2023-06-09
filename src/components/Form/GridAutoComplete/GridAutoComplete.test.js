/* eslint-disable arrow-body-style */
/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { Form as AntdForm } from 'antd';
import WithAppWrapper from '../../../hoc/withAppWrapper';
import Form from '../index';
import GridAutoComplete from './index';

let container = null;

// eslint-disable-next-line no-undef
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

// eslint-disable-next-line no-undef
afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const searchMockData = [
  {
    name: 'RSBCIHI',
    value: 'RSBCIHI',
    insurancePayerId: 365,
    payerTypeId: null,
    payerId: null,
    payerName: null,
    comments: '',
    address: '11555 1/2 POTRERO RD  BANNING California United States',
    phone: '9518494761',
    is_Moderate: false,
    submissionMethodName: 'Electronic/Waystar',
    favouriteUsers: [],
    electronicClaimAgingDays: 0,
    paperClaimAgingDays: 0,
    modifiedBy: 7,
    modifiedByName: 'Neeraj kumar',
    isActive: true,
    faxNumber: '',
    payerMappingConfiguration: null,
    id: '365',
    createdOn: '2023-04-03T13:16:23.0970255Z',
    modifiedOn: null,
  },
  {
    name: 'RSBCIHI',
    value: 'RSBCIHI',
    insurancePayerId: 365,
    payerTypeId: null,
    payerId: null,
    payerName: null,
    comments: '',
    address: '11555 1/2 POTRERO RD  BANNING California United States',
    phone: '9518494761',
    is_Moderate: false,
    submissionMethodName: 'Electronic/Waystar',
    favouriteUsers: [],
    electronicClaimAgingDays: 0,
    paperClaimAgingDays: 0,
    modifiedBy: 7,
    modifiedByName: 'Neeraj kumar',
    isActive: true,
    faxNumber: '',
    payerMappingConfiguration: null,
    id: '365',
    createdOn: '2023-04-03T13:16:23.0970255Z',
    modifiedOn: null,
  },
];

const mockProps = {
  name: 'healthPlan',
  url: 'masterservice/InsurancePayer',
  optionMaster: 'SearchText',
  labelSpan: '8',
  inputSpan: '16',
  disabled: false,
  required: true,
  initialValue: {},
  columns: [
    {
      Header: 'Name',
      accessor: 'name',
      flex: 3,
    },
    {
      Header: 'Phone',
      flex: 2,
    },
    {
      Header: 'Submission Method',
      accessor: 'submissionMethodName',
      flex: 3,
    },
    {
      Header: 'Address',
      accessor: 'address',
      flex: 5,
    },
  ],
  style: {
    width: '100%',
  },
  className: '',
  notFoundContent: 'Payer is not present is the system.',
  showArrow: true,
  labelInValue: true,
  selectProps: {
    optionLabelProp: 'name',
    allowClear: true,
  },
  params: {
    sortBy: 'name',
    sortorder: 'asc',
  },
  label: 'Health Plan',
  labels: {},
  form: {},
  placeholder: 'Select an option',
  rules: [],
  fetchInitial: true,
  setFirstOptionSelected: false,
  minCharLength: 3,
  isFormItem: true,
  header: true,
  showTotalCount: false,
  allowClear: false,
  tooltipKey: '',
  customInnerTextKey: '',
};

jest.mock('../../../hooks/useCRUD', () => () => {
  return [searchMockData, false, false, jest.fn(), jest.fn()];
});

const RenderComponent = () => {
  const [form] = AntdForm.useForm();
  return (
    <Form form={form}>
      <GridAutoComplete {...mockProps} />
    </Form>
  );
};

test('should render custom GridAutoComplete component', () => {
  const WrappedCustomAutoCompleteComponent = WithAppWrapper(RenderComponent);
  act(() => {
    render(<WrappedCustomAutoCompleteComponent />, container);
  });
  const autoCompleteInput = screen.getByTestId('GridAutoComplete');
  expect(autoCompleteInput).toBeInTheDocument();
});

test('should be able to search value', async () => {
  const WrappedCustomAutoCompleteComponent = WithAppWrapper(RenderComponent);
  act(() => {
    render(<WrappedCustomAutoCompleteComponent />, container);
  });
  const autoCompleteSelect = screen
    .getByTestId('GridAutoComplete')
    .querySelector('.ant-select-selection-search-input');
  userEvent.click(autoCompleteSelect);
  userEvent.type(autoCompleteSelect, 'RSBCIHI');
  expect(autoCompleteSelect.value).toEqual('RSBCIHI');
  const result = screen.getByRole('listbox');
  expect(result).toBeInTheDocument();
});
