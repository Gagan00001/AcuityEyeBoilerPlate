import React, { useEffect, useState, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import get from "lodash/get";
import classNames from "classnames";
import PropTypes from "prop-types";
import isFunction from "lodash/isFunction";
import { Form as FormComponent } from "antd";
import styled from "styled-components";

import {
  addFormData,
  clearFormData as clearCachedFormData,
} from "../../store/actions/form";
import useRedirect from "../../hooks/useRedirect";
import autoFocus from "./autoFocus";
import "./Form.scss";
import {
  requestAddEntity,
  requestGetEntity,
  requestUpdateEntity,
  clearFormData,
  requestUpsertEntity,
} from "../../store/actions/formHandler";
import Loader from "../Loader";
import Error from "../Error";
import Notification from "../Notification";
import ErrorMessages from "../../lib/errorMessages";
import { store } from "../../store";
import Events from "../../lib/events";
import { getRandomNumber } from "../../lib/util";

const getGridTemplateColumnsWidth = (props) => {
  const minWidth = props.sectionMinWidth
    ? `${props.sectionMinWidth}px`
    : "256px";
  return `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
};

const getGridColumnGap = (props) => `${6 / (props.noOfColumns || 1)}%`;

const GridSection = styled.div`
  grid-template-columns: ${(props) => getGridTemplateColumnsWidth(props)};
  grid-column-gap: ${(props) => getGridColumnGap(props)};
`;

function Row({ children, columnLength, columnTemplate }) {
  return (
    <div
      className="form-grid-row"
      style={{
        gridAutoColumns: columnLength,
        gridTemplateColumns: columnTemplate,
      }}
    >
      {children}
    </div>
  );
}

Row.defaultProps = {
  children: [],
  columnLength: "auto",
  columnTemplate: "auto",
};

Row.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  columnLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  columnTemplate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

function Section({ children, ...otherProps }) {
  return (
    <GridSection className="form-grid-component" {...otherProps}>
      {children}
    </GridSection>
  );
}
Section.defaultProps = {
  children: [],
};

Section.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
function Column({ children, rowHeight, rowTemplate, style = {} }) {
  return (
    <div
      className="form-grid-column"
      style={{
        gridAutoRows: rowHeight,
        gridTemplateRows: rowTemplate,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

Column.defaultProps = {
  children: [],
  rowHeight: "auto",
  rowTemplate: "auto",
};

Column.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rowTemplate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
function Item({
  children,
  className,
  rowSpan,
  label,
  name,
  required,
  errorMessage,
  rules,
  ...otherProps
}) {
  return (
    <FormComponent.Item
      className={classNames(
        "form-item",
        className,
        rowSpan ? "form-item-rowspan" : ""
      )}
      style={rowSpan ? { gridRow: `span ${rowSpan}` } : {}}
      label={label}
      name={name}
      // validateTrigger="onBlur"
      rules={[
        {
          required,
          message: errorMessage,
        },
        ...rules,
      ]}
      {...otherProps}
    >
      {children}
    </FormComponent.Item>
  );
}

const updateLocalStorage = (formId, response, payload) => {
  if (formId === "patient") {
    const patients = JSON.parse(localStorage.getItem("patients"));
    const newPatientRecord = {
      lastModified: new Date(),
      lastModifiedBy: "Loretta Rois",
      ...payload,
      id: response.patientId,
    };
    const { firstName, middleName, lastName } = newPatientRecord;
    let name = firstName;
    if (middleName) name += ` ${middleName}`;
    name += ` ${lastName}`;
    newPatientRecord.name = name;
    patients.unshift(newPatientRecord);
    localStorage.setItem("patients", JSON.stringify(patients));
  } else if (formId === "location") {
    const locations = JSON.parse(localStorage.getItem("settings_locations"));
    const newRecord = {
      lastModified: new Date(),
      ...payload,
      id: response.locationId,
    };
    locations.unshift(newRecord);
    localStorage.setItem("settings_locations", JSON.stringify(locations));
  }
};
function Form(props) {
  const { params } = useRedirect();
  const dispatch = useDispatch();
  const {
    name,
    size,
    formItemLayout,
    noOfColumns,
    sectionMinWidth,
    children,
    onFinish,
    onFinishFailed,
    section,
    form,
    formDataToStore,
    formId,
    url,
    tabId, // added to remove warning from console
    isUpdate,
    onAddEntity,
    onGetEntity,
    onUpdateEntity,
    parser,
    onRequestComplete,
    error,
    loading,
    response,
    payload,
    getUrl,
    initialDataParser,
    currentFormData,
    clearCurrentFormData,
    initialData,
    contentType,
    listId,
    editKey = params.id,
    onGetResponseComplete,
    extraData,
    onClearCurrentFormData,
    getDataUsingCrud,
    validator,
    isGetRequest,
    shouldShowLoader,
    onRequestFail,
    isCustomError,
    customErrorMessage,
    refetchId,
    loaderComponent: LoaderComponent,
    scrollToFirstError,
    disableForm,
    flexStyle,
    onValueChange,
    isUpsertForm,
    onUpsertEntity,
    idPath = "response.id",
    idPayloadKey = "URL",
    switchMethod,
    upsertId,
    ...otherProps
  } = props;
  const [initialValues, setInitialValues] = useState(initialData || {});
  const [previousId, setPreviousId] = useState(null);
  const [isInitialValuesSet, setInitialValuesStatus] = useState(false);
  const [updatedFieldsData, setUpdatedFieldsData] = useState([]);

  let getExtraData = () => extraData;

  if (isFunction(extraData)) {
    getExtraData = extraData;
  }

  useEffect(() => {
    if (
      !isUpdate &&
      initialData &&
      Object.values(initialData).length &&
      !isInitialValuesSet
    ) {
      setInitialValues(initialData || {});
      setInitialValuesStatus(true);
    }
  }, [isUpdate, initialData, isInitialValuesSet, setInitialValuesStatus]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (response) {
      if (isFunction(onRequestComplete)) {
        onRequestComplete({
          error,
          response,
        });
        if (!isUpdate) {
          updateLocalStorage(formId, response, payload);
        }
        clearCurrentFormData(formId);
      }
    }
    if (error) {
      let { message: messages } = error;
      if (get(error, "response.data.Errors")) {
        messages = get(error, "response.data.Errors", []);
      } else if (
        get(error, "response.data.Message") ||
        get(error, "response.data.message")
      ) {
        messages =
          get(error, "response.data.Message") ||
          get(error, "response.data.message");
      }

      clearCurrentFormData(formId);
      if (onRequestFail) {
        return onRequestFail(messages, get(error, "response.data", {}));
      }
      if (isCustomError && messages.indexOf("404") > -1) {
        Notification({ message: <Error messages={customErrorMessage} /> });
      } else Notification({ message: <Error messages={messages} /> });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, response]);

  useEffect(() => {
    const updatedData = [];
    const storeForm = store.getState("form").form;
    const currentTab =
      storeForm.get(storeForm.get("currentTab")) &&
      storeForm.get(storeForm.get("currentTab")).toJS();
    const savedFormData = currentTab && currentTab[name];
    if (currentFormData) {
      let formData = {};
      if (Object.keys(currentFormData).length) {
        formData = initialDataParser({ ...currentFormData });
        setInitialValues(formData);
      } else {
        setInitialValues({ ...initialData });
      }
      if (savedFormData) {
        Object.keys(savedFormData).forEach((key) => {
          updatedData.push({ name: key, value: savedFormData[key] });
        });
        setUpdatedFieldsData(updatedData);
      }
      clearCurrentFormData(formId);
    } else if (!getUrl) {
      if (savedFormData) {
        Object.keys(savedFormData).forEach((key) => {
          updatedData.push({ name: key, value: savedFormData[key] });
        });
        setUpdatedFieldsData(updatedData);
      }
    }
  }, [clearCurrentFormData, currentFormData, formId, initialDataParser, name]);

  useEffect(() => {
    if (form) {
      form.resetFields();
    }
  }, [initialValues, params.tabId, form]);

  useEffect(() => {
    if (form) {
      form.setFields(updatedFieldsData);
    }
  }, [updatedFieldsData, form]);

  useEffect(() => {
    if (Object.values(initialValues).length && onGetResponseComplete) {
      onGetResponseComplete(initialValues);
    } else if (isFunction(onGetResponseComplete)) {
      onGetResponseComplete({});
    }
  }, [initialValues]);

  useEffect(
    () => {
      if (isUpdate && previousId !== editKey && getUrl) {
        onGetEntity(getUrl, formId);
        setPreviousId(editKey);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isUpdate,
      getUrl,
      formId,
      listId,
      dispatch,
      editKey,
      onGetEntity,
      previousId,
      initialValues,
    ]
  );

  useEffect(() => {
    if (refetchId) {
      Events.on(refetchId, refetchId, () => onGetEntity(getUrl, formId));
      return () => Events.remove(refetchId);
    }
    return () => {
      /* This is intentional */
    };
  }, [getUrl]);

  const customOnFinish = (onFinishData) => {
    let entity = { ...onFinishData };
    delete entity[""];
    if (isFunction(parser)) {
      entity = parser(entity, form.getFieldValue());
    }
    if (isFunction(validator)) {
      const isValidate = validator(entity);
      if (!isValidate) return;
    }
    if (contentType) {
      entity.contentType = contentType;
    }
    if (isFunction(onFinish)) {
      onFinish(entity);
      return;
    }

    if (isUpdate) {
      onUpdateEntity(url, formId, { ...getExtraData(), ...entity });
    } else if (isUpsertForm) {
      onUpsertEntity(
        url,
        formId,
        idPath,
        idPayloadKey,
        switchMethod,
        upsertId,
        { ...getExtraData(), ...entity }
      );
    } else {
      onAddEntity(url, formId, { ...getExtraData(), ...entity });
    }
  };

  const customErrorHandler = (errorInfo) => {
    if (errorInfo.errorFields.length && scrollToFirstError) {
      autoFocus(errorInfo.errorFields[0].name, form);
    }
    if (onFinishFailed) {
      onFinishFailed(errorInfo);
    } else {
      const requiredError = errorInfo?.errorFields.find(
        (err) =>
          err.errors[0].indexOf("is required") > -1 || err.errors[0] === " "
      );
      if (requiredError) {
        Notification({
          message: ErrorMessages.PLEASE_FILL_ALL_REQUIRED_FIELDS,
        });
      } else {
        Notification({ message: errorInfo?.errorFields[0].errors[0] });
      }
    }
  };

  const resetForm = useCallback(() => {
    const formData = form.getFieldValue();
    onClearCurrentFormData(name);
    form.resetFields();
    Object.keys(formData).forEach((item) => {
      Events.trigger(`resetForm-${item}`);
    });
  }, [onClearCurrentFormData, name, form]);

  const onValuesChange = useCallback(
    (changedFormValues, allValues) => {
      if (isFunction(onValueChange))
        onValueChange(changedFormValues, allValues);
      formDataToStore(changedFormValues);
    },
    [formDataToStore, onValueChange]
  );

  const customSetFieldsValue = useCallback(
    (data = {}) => {
      const storeForm = store.getState("form").form;
      const currentTab =
        storeForm.get(storeForm.get("currentTab")) &&
        storeForm.get(storeForm.get("currentTab")).toJS();
      const savedFormData = currentTab && currentTab[name];
      form.setFieldsValue(data);
      formDataToStore({ ...savedFormData, ...data });
    },
    [form, formDataToStore, name]
  );

  if (form) {
    form.customSetFieldsValue = customSetFieldsValue;
    form.completeReset = resetForm;
  }

  return (
    <>
      {loading && shouldShowLoader ? <LoaderComponent /> : null}
      <div
        title={disableForm && "View Mode"}
        style={disableForm ? { cursor: "not-allowed" } : { ...flexStyle }}
      >
        <div
          style={disableForm ? { pointerEvents: "none", opacity: "0.8" } : {}}
        >
          <FormComponent
            name={name}
            size={size}
            initialValues={initialValues}
            labelAlign="left"
            colon={false}
            onFinish={customOnFinish}
            onFinishFailed={customErrorHandler}
            form={form}
            {...formItemLayout}
            {...otherProps}
            hideRequiredMark
            onValuesChange={onValuesChange}
          >
            {section ? (
              <div className="fields-wrapper">
                {isFunction(children) && children({ resetForm })}
                {!isFunction(children) && children}
              </div>
            ) : (
              <GridSection
                className="form-grid-component"
                noOfColumns={noOfColumns}
                sectionMinWidth={sectionMinWidth}
              >
                {isFunction(children) && children({ resetForm })}
                {!isFunction(children) && children}
              </GridSection>
            )}
          </FormComponent>
        </div>
      </div>
    </>
  );
}
Form.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string,
  formItemLayout: PropTypes.objectOf(PropTypes.object),
  noOfColumns: PropTypes.number,
  onFinish: PropTypes.func,
  initialDataParser: PropTypes.func,
  extraData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  sectionMinWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  section: PropTypes.bool,
  onFinishFailed: PropTypes.func,
  form: PropTypes.instanceOf(Object),
  formDataToStore: PropTypes.func,
  url: PropTypes.string,
  formId: PropTypes.string,
  tabId: PropTypes.string,
  isUpdate: PropTypes.bool,
  onAddEntity: PropTypes.func,
  onGetEntity: PropTypes.func,
  onUpdateEntity: PropTypes.func,
  parser: PropTypes.func,
  onRequestComplete: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
  loading: PropTypes.bool,
  response: PropTypes.instanceOf(Object),
  payload: PropTypes.instanceOf(Object),
  getUrl: PropTypes.string,
  currentFormData: PropTypes.instanceOf(Object),
  clearCurrentFormData: PropTypes.func,
  initialData: PropTypes.instanceOf(Object),
  contentType: PropTypes.string,
  listId: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  editKey: PropTypes.string,
  onGetResponseComplete: PropTypes.func,
  onClearCurrentFormData: PropTypes.func,
  getDataUsingCrud: PropTypes.bool,
  validator: PropTypes.func,
  onGetResponseFail: PropTypes.func,
  shouldShowLoader: PropTypes.bool,
  onRequestFail: PropTypes.func,
  createdByName: PropTypes.bool,
  loaderComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  scrollToFirstError: PropTypes.bool,
  disableForm: PropTypes.bool,
  flexStyle: PropTypes.instanceOf(Object),
};
Form.defaultProps = {
  name: "form",
  size: "middle", // small | middle | large
  formItemLayout: {
    labelCol: { span: 7 },
    wrapperCol: { span: 20 },
  },
  noOfColumns: 1,
  initialDataParser: (data) => data,
  extraData: {},
  onFinish: null,
  formId: `${getRandomNumber() * 1000}`,
  sectionMinWidth: null,
  children: [],
  section: false,
  onFinishFailed: null,
  form: undefined,
  formDataToStore: null,
  url: null,
  tabId: null,
  isUpdate: false,
  onAddEntity: null,
  onGetEntity: null,
  onUpdateEntity: null,
  parser: null,
  onRequestComplete: null,
  error: null,
  loading: false,
  response: null,
  payload: null,
  getUrl: "",
  currentFormData: null,
  clearCurrentFormData: null,
  initialData: null,
  contentType: null,
  listId: "",
  onGetResponseComplete: null,
  onClearCurrentFormData: null,
  getDataUsingCrud: false,
  validator: null,
  onGetResponseFail: null,
  shouldShowLoader: true,
  onRequestFail: null,
  loaderComponent: Loader,
  createdByName: false,
  scrollToFirstError: true,
  disableForm: false,
  flexStyle: { flex: 1 },
};

Item.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  rowSpan: PropTypes.number,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.object),
  getDataUsingCrud: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
Item.defaultProps = {
  label: "",
  name: "",
  className: "",
  required: false,
  errorMessage: "",
  rowSpan: 0,
  rules: [],
  getDataUsingCrud: false,
  children: [],
};
Form.Row = Row;
Form.Column = Column;
Form.Item = Item;
Form.Section = Section;

const mapStateToProps = ({ formHandler }, ownProps) => ({
  response:
    formHandler.get(ownProps.formId) &&
    formHandler.get(ownProps.formId).response,
  loading:
    formHandler.get(ownProps.formId) &&
    formHandler.get(ownProps.formId).loading,
  error:
    formHandler.get(ownProps.formId) && formHandler.get(ownProps.formId).error,
  payload:
    formHandler.get(ownProps.formId) &&
    formHandler.get(ownProps.formId).payload,
  currentFormData:
    formHandler.get(ownProps.formId) &&
    formHandler.get(ownProps.formId).currentFormData,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const { name, tabId } = ownProps;
  return {
    formDataToStore: (values) => {
      if (tabId) {
        const fieldsData = { ...values };
        const payload = {
          fieldsData,
          name,
        };
        return dispatch(addFormData(payload));
      }
      return false;
    },
    onAddEntity: (url, formId, data) =>
      dispatch(requestAddEntity(url, formId, data)),
    onUpdateEntity: (url, formId, data) =>
      dispatch(requestUpdateEntity(url, formId, data)),
    onUpsertEntity: (
      url,
      formId,
      idPath,
      idPayloadKey,
      switchMethod,
      upsertId,
      data
    ) =>
      dispatch(
        requestUpsertEntity(
          url,
          formId,
          idPath,
          idPayloadKey,
          switchMethod,
          upsertId,
          data
        )
      ),
    onGetEntity: (url, formId) => dispatch(requestGetEntity(url, formId)),
    clearCurrentFormData: (formId) => dispatch(clearFormData(formId)),
    onClearCurrentFormData: (formName) =>
      dispatch(clearCachedFormData(formName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
