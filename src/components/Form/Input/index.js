import React, { useCallback } from "react";
import { Form, Input, Row, Col } from "antd";
import PropTypes from "prop-types";
import "./index.scss";
import cloneDeep from "lodash/cloneDeep";
import classNames from "classnames";

const validationChecker = (condition, errorMessage) => {
  if (condition) {
    return Promise.resolve();
  }
  return Promise.reject(errorMessage);
};

const alphanumericRegex = (decimalPlaces = 0, addNegative = "") => {
  const decimalRegex = `(\\.[0-9]{0,${decimalPlaces}})?`;
  return new RegExp(
    `^${addNegative}[a-zA-Z0-9${decimalPlaces ? "" : " "}]*${
      decimalPlaces ? decimalRegex : ""
    }$`
  );
};
const numbersWithSpecialCharsRegex = /^[0-9#?!@$%^&*-/]+$/;
const numberOnlySignRegex = (decimalPlaces) =>
  new RegExp(`^-?[0-9]*(.[0-9]{1,${decimalPlaces || 2}})?$`);
const numberWithHyphenRegex = /^[0-9-]+$/;
const numberWithDecimalPlaces = /^\d{0,8}(\.\d{1,2})?$/;
const valueAfterDecimal = /^\d*\.?\d+$/;
const numberRegex = (decimalPlaces = 0, addNegative = "") => {
  const decimalRegex = `(\\.[0-9]{0,${decimalPlaces}})?`;
  return new RegExp(
    `^${addNegative}[0-9]+${decimalPlaces ? decimalRegex : ""}$`
  );
};
const naturalNumberRegex = /^[1-9]\d*$/;
const passwordRegex = /(?=.*\d)/;
const updatePasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,15}$/;
const passwordValidator = (rules, value) =>
  !value
    ? Promise.resolve()
    : validationChecker(
        passwordRegex.test(value.trim()),
        "The password must contain at least 1 numeric character"
      );
const updatePasswordValidator = (rules, value) =>
  !value
    ? Promise.resolve()
    : validationChecker(
        updatePasswordRegex.test(value.trim()),
        "The password must contain at least 1 numeric, 1 lowercase, 1 uppercase and 1 special character and should be of minimum 8 characters"
      );

const numWithSpecialCharValidator = (rules, value) =>
  !value
    ? Promise.resolve()
    : validationChecker(
        numbersWithSpecialCharsRegex.test(value.trim()),
        "Value should contain numbers and special characters only"
      );
const stringValidator = (rules, value) =>
  !value
    ? Promise.resolve()
    : validationChecker(true, "Value should contain characters only");
const alphaNumericValidator =
  (decimalPlaces, isNegative = false) =>
  (rules, value) => {
    if (!value) {
      return Promise.resolve();
    }
    if (isNegative) {
      return validationChecker(
        alphanumericRegex(decimalPlaces, "-?").test(value),
        <ul className="error-type-list">
          <li>Positive/negative values.</li>
          <li>
            <div>Number of decimals: {decimalPlaces}.</div>
          </li>
          <li>Space not allowed.</li>
        </ul>
      );
    }
    return validationChecker(
      alphanumericRegex().test(value.trim()),
      "Value should be alphanumeric"
    );
  };
const numberWithDecimalPlacesValidator = (rules, value) =>
  !value
    ? Promise.resolve()
    : validationChecker(
        numberWithDecimalPlaces.test(value.trim()),
        "Amount format should be XXXXXXXX.XX"
      );
const numberValidator =
  (decimalPlaces, isNegative = false) =>
  (rules, value) => {
    if (!value) {
      return Promise.resolve();
    }
    let errorMsg = "Value should contain numbers only";
    if (decimalPlaces) {
      errorMsg = `Value should contain numbers only with upto ${decimalPlaces} decimal places`;
    }
    if (isNegative) {
      return validationChecker(
        numberRegex(decimalPlaces, "-?").test(value),
        errorMsg
      );
    }
    return validationChecker(numberRegex(decimalPlaces).test(value), errorMsg);
  };
const isValueAfterDecimalValidator = (rules, value) =>
  !value
    ? Promise.resolve()
    : validationChecker(
        valueAfterDecimal.test(value.trim()),
        "There should be numbers after decimal"
      );

const numberOnlySignValidator =
  (decimalPlaces = 0) =>
  (rules, value) =>
    !value
      ? Promise.resolve()
      : validationChecker(
          numberOnlySignRegex(decimalPlaces).test(value.trim()),
          "Value should be a valid number"
        );
const numberWithHyphenValidator = (rules, value) =>
  !value
    ? Promise.resolve()
    : validationChecker(
        numberWithHyphenRegex.test(value.trim()),
        "Value should be a valid"
      );
const naturalNumberValidator = (rules, value) =>
  !value
    ? Promise.resolve()
    : validationChecker(
        naturalNumberRegex.test(value.trim()),
        "Value should be a natural number"
      );
const requiredValidator = (label) => (rules, value) =>
  value && `${value}`.trim().length
    ? Promise.resolve()
    : validationChecker(
        value && `${value?.trim()}`?.length,
        `${label} is required`
      );
const handleKeyDown = (e) => {
  if (
    !(
      (e.key >= 0 && e.key <= 9) ||
      e.key === "." ||
      e.key === "Backspace" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Delete" ||
      e.key === "Enter" ||
      e.key === "Tab" ||
      (e.ctrlKey && (e.key === "a" || e.key === "c"))
    )
  ) {
    e.preventDefault();
  }
};

const applyAddOnRules = (clonedRules, props) => {
  const {
    charOnly,
    alphaNumericOnly,
    numberOnly,
    numbersAndSpecialChars,
    decimalPlaces,
    type,
    applyValidation,
    numberOnlyWithSign,
    updatePassword,
    numberWithHyphen,
    numberWithDecimal,
    naturalNumberOnly,
    isValueAfterDecimal,
    required,
    label,
    allowNegative,
  } = props;
  if (isValueAfterDecimal) {
    clonedRules.push({ validator: isValueAfterDecimalValidator });
  }
  if (updatePassword) {
    clonedRules.push({ validator: updatePasswordValidator });
  }
  if (numberOnly) {
    clonedRules.push({
      validator: numberValidator(decimalPlaces, allowNegative),
    });
  }
  if (alphaNumericOnly) {
    clonedRules.push({
      validator: alphaNumericValidator(decimalPlaces, allowNegative),
    });
  }
  if (numberOnlyWithSign) {
    clonedRules.push({ validator: numberOnlySignValidator(decimalPlaces) });
  }
  if (numbersAndSpecialChars) {
    clonedRules.push({ validator: numWithSpecialCharValidator });
  }
  if (numberWithHyphen) {
    clonedRules.push({ validator: numberWithHyphenValidator });
  }
  if (charOnly) {
    clonedRules.push({ validator: stringValidator });
  }
  if (numberWithDecimal) {
    clonedRules.push({ validator: numberWithDecimalPlacesValidator });
  }
  if (naturalNumberOnly) {
    clonedRules.push({ validator: naturalNumberValidator });
  }
  if (type === "password" && applyValidation) {
    clonedRules.push({ validator: passwordValidator });
  }
  if (required) {
    clonedRules.push({ validator: requiredValidator(label) });
  }
};

const getNumberString = (numberOnly) => (numberOnly ? "digits" : "characters");

const getTextInput = (Component) => {
  const TextInputComponent = (props) => {
    const {
      label,
      value,
      name,
      required,
      labelSpan,
      inputSpan,
      rules,
      disabled,
      id,
      charOnly,
      maxValueLength,
      minValueLength,
      alphaNumericOnly,
      numberOnly,
      numbersAndSpecialChars,
      decimalPlaces,
      onClick,
      className,
      placeholder,
      autoSize,
      labelAfter,
      type,
      inputProps,
      onChange,
      onBlur,
      isFormItem,
      applyValidation,
      numberOnlyWithSign,
      updatePassword,
      numberWithHyphen,
      numberWithDecimal,
      dataTestId,
      showInputTooltip,
      isValueAfterDecimal,
      ...otherProps
    } = props;
    const clonedRules = cloneDeep(rules);
    applyAddOnRules(clonedRules, props);

    if (maxValueLength) {
      clonedRules.push({
        max: maxValueLength,
        message: `${label} cannot be longer than ${maxValueLength} ${getNumberString(
          numberOnly
        )}`,
      });
    }

    if (minValueLength) {
      clonedRules.push({
        min: minValueLength,
        message: `${label} must be at least ${minValueLength} ${getNumberString(
          numberOnly
        )}`,
      });
    }

    const setTitle = useCallback((e) => {
      const inputs = e?.currentTarget?.getElementsByTagName("input");
      if (inputs?.length) {
        Array.from(inputs).forEach((item) => {
          item.setAttribute("title", item.value);
        });
      }
    }, []);

    return (
      <div className={classNames("custom-input", className)}>
        <Row>
          <Col
            span={labelSpan}
            order={labelAfter && 1}
            className={classNames({ space: labelAfter })}
          >
            <div className="ant-form-item-label ant-form-item-label-left">
              <label
                className={classNames("ant-form-item-no-colon")}
                title={label}
                htmlFor={id}
              >
                {label}
              </label>
              <span
                className={classNames(
                  "req-star",
                  required && "ant-form-item-required"
                )}
              />
            </div>
          </Col>
          <Col
            span={inputSpan}
            onMouseEnter={showInputTooltip ? setTitle : () => {}}
          >
            {isFormItem ? (
              <Form.Item name={name} rules={[...clonedRules]} {...otherProps}>
                <Component
                  value={value}
                  name={name}
                  placeholder={placeholder}
                  autoSize={autoSize}
                  onClick={onClick}
                  maxLength={maxValueLength}
                  disabled={disabled}
                  // onKeyDown={numberOnly && handleKeyDown}
                  type={type}
                  onBlur={onBlur}
                  {...inputProps}
                  onChange={onChange}
                  data-testid={dataTestId || name}
                />
              </Form.Item>
            ) : (
              <Component
                value={value}
                name={name}
                placeholder={placeholder}
                autoSize={autoSize}
                onClick={onClick}
                maxLength={maxValueLength}
                disabled={disabled}
                // onKeyDown={numberOnly && handleKeyDown}
                type={type}
                onBlur={onBlur}
                {...otherProps}
                {...inputProps}
                onChange={onChange}
                data-testid={dataTestId || name}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  };

  TextInputComponent.defaultProps = {
    label: "",
    name: "",
    rules: [],
    required: false,
    disabled: false,
    labelSpan: 10,
    inputSpan: 14,
    onClick: (event) => event.stopPropagation(),
    className: "",
    id: "",
    placeholder: "",
    value: undefined,
    charOnly: false,
    maxValueLength: null,
    minValueLength: null,
    alphaNumericOnly: false,
    numberOnly: false,
    decimalPlaces: 0,
    autoSize: {},
    labelAfter: false,
    type: "text",
    inputProps: {},
    isFormItem: true,
    onChange: () => {
      /* This is intentional */
    },
    applyValidation: true,
    dataTestId: "",
    showInputTooltip: true,
  };

  TextInputComponent.propTypes = {
    labelSpan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    inputSpan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    className: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    rules: PropTypes.instanceOf(Array),
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    charOnly: PropTypes.bool,
    maxValueLength: PropTypes.number,
    minValueLength: PropTypes.number,
    alphaNumericOnly: PropTypes.bool,
    numberOnly: PropTypes.bool,
    decimalPlaces: PropTypes.number,
    autoSize: PropTypes.instanceOf(Object),
    labelAfter: PropTypes.bool,
    type: PropTypes.string,
    inputProps: PropTypes.instanceOf(Object),
    isFormItem: PropTypes.bool,
    onChange: PropTypes.func,
    applyValidation: PropTypes.bool,
    dataTestId: PropTypes.string,
    showInputTooltip: PropTypes.bool,
  };

  return TextInputComponent;
};

const TextInput = React.memo(getTextInput(Input));
TextInput.TextArea = React.memo(getTextInput(Input.TextArea));

export default TextInput;
