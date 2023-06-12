import React from "react";
import PropTypes from "prop-types";
import { Form, Radio } from "antd";
import cloneDeep from "lodash/cloneDeep";

import { idCalculator } from "../../../lib/util";

const RadioGroup = ({
  tabList,
  onChange,
  value,
  id,
  defaultValue,
  isFormItem,
  name,
  required,
  rules,
  ...otherProps
}) => {
  const clonedRules = cloneDeep(rules);
  if (required) {
    clonedRules.push({
      required: true,
      message: `${name} is required`,
    });
  }
  return (
    <div>
      {isFormItem ? (
        <Form.Item name={name} rules={[...clonedRules]} {...otherProps}>
          <Radio.Group
            value={value}
            buttonStyle="solid"
            onChange={onChange}
            defaultValue={defaultValue}
          >
            {tabList &&
              tabList.length > 0 &&
              tabList.map((item) => (
                <Radio.Button
                  id={idCalculator(id, item.value)}
                  value={item.value}
                  key={item.value}
                  data-testId={idCalculator("radio_group", item.value)}
                >
                  {item.label}
                </Radio.Button>
              ))}
          </Radio.Group>
        </Form.Item>
      ) : (
        <Radio.Group
          value={value}
          buttonStyle="solid"
          onChange={onChange}
          defaultValue={defaultValue}
        >
          {tabList &&
            tabList.length > 0 &&
            tabList.map((item) => (
              <Radio.Button
                id={idCalculator(id, item.value)}
                value={item.value}
                key={item.value}
                data-testId={idCalculator("radio_group", item.value)}
              >
                {item.label}
              </Radio.Button>
            ))}
        </Radio.Group>
      )}
    </div>
  );
};

RadioGroup.defaultProps = {
  tabList: [],
  onChange: () => {
    /* This is intentional */
  },
  value: "",
  defaultValue: "",
  id: "",
  isFormItem: false,
  rules: [],
  name: "",
  required: false,
  disabled: false,
};

RadioGroup.propTypes = {
  tabList: PropTypes.instanceOf(Array),
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isFormItem: PropTypes.bool,
  rules: PropTypes.instanceOf(Array),
  name: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
};

export default React.memo(RadioGroup);
