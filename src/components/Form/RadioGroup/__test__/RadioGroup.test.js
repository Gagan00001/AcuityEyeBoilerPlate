import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import idCalculator from '../../../../lib/idCalculator';
import RadioGroup from '..';

let container = null;
const mockTabList = [
  { value: 'general', label: 'General' },
  { value: 'exception', label: 'Exceptions' },
  { value: 'modifiers', label: 'Modifiers' },
];

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('RadioGroup', () => {
  const props = {
    tabList: mockTabList,
    onChange: jest.fn(),
    value: 'general',
    labels: 'contracts/edit/terms',
    id: 'contract_terms_tabs',
  };

  const RenderRadioGroupComponent = () => (
    <RadioGroup {...props} />
  );

  test('should match snapshot', () => {
    const { container: Container } = render(
      <RenderRadioGroupComponent />, container,
    );
    expect(Container).toMatchSnapshot();
  });

  test('should render component', async () => {
    render(<RenderRadioGroupComponent />, container);
    mockTabList.forEach((tabList) => expect(screen.getByText(tabList.label)).toBeInTheDocument());
  });

  test('validate checked property of radio group', () => {
    render(<RenderRadioGroupComponent />, container);
    const radioGroupList = [];
    mockTabList.forEach((item, index) => {
      radioGroupList.push(screen.getByTestId(idCalculator('radio_group', item.value)));
      fireEvent.change(radioGroupList[index], { target: { checked: index === 1 } });
    });
    expect(radioGroupList[1].checked).toBe(true);
  });
});
