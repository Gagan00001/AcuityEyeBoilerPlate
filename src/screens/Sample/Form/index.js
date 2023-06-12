import React, { useCallback, useState } from "react";
import { Form as AntdForm } from "antd";

import useRedirect from "../../../hooks/useRedirect";

import { contentType, formName } from "../../../lib/constants";
import { apiUrls } from "../../../api/constants";
import SuccessMessages from "../../../lib/successMessages";
import { toDateValidator } from "../../../lib/util";
import formFieldValueParser from "../../../lib/formFieldValuesParser";

import Form from "../../../components/Form";
import {
  Input,
  CheckBox,
  DatePicker,
  SelectBox as FormSelect,
  AutoComplete,
  PhoneNumberInput,
} from "../../../components/Form/inputFields";

import Button from "../../../components/Button";
import Notification from "../../../components/Notification";
// import Upload from "../../../../../../components/Upload";

// import Select from "../../../../../../wiredComponents/Enum/Select";
// import EnumCheckbox from "../../../../../../wiredComponents/Enum/Checkbox";
// import TimeCell from "../../../../../../components/Cells/TimeCell";
// import useCRUD from "../../../../../../hooks/useCRUD";

// import { getEnumMasterData } from "../../../../../../store/actions/enum";
// import {
//   getEnumMaster,
//   getEnumOptions,
//   getTableDataById,
// } from "../../../../../../store/selectors";

const minutesOptions = [];

for (let index = 5; index <= 60; index += 5) {
  minutesOptions.push({
    label: `${index}`,
    value: `${index}`,
    name: `${index}`,
  });
}

const displayOptions = [{ label: "As Multi-Tenant", value: "multi" }];

const zipOptionParser = (option) => ({
  name: option.zipCode,
  value: option.zipCode,
  ...option,
});

const specialityOptionParser = (options) =>
  options?.filter(
    (item) => item?.masterCode?.toLowerCase() !== "outsidereferrals"
  );

const SampleForm = ({ labels, isBusinessEntityViewOnly }) => {
  const [form] = AntdForm.useForm();
  const [country, setCountry] = useState(0);
  const [formData, setFormData] = useState({});
  const { params } = useRedirect();

  const onZipCodeSelect = useCallback(
    (option = {}) => {
      form.setFieldsValue({
        city: option.city,
        stateId: option.stateId,
        countryId: option.countryId,
      });
      setCountry(option.countryId);
    },
    [form]
  );

  const initialDataParser = useCallback((generalInfo) => {
    const logo = [];
    if (generalInfo.imageFileName) {
      logo.push({
        uid: "-1",
        name: "Logo",
        status: "done",
        url: generalInfo.imageUrl,
        type: generalInfo.imageType,
      });
    }
    const otherFields = formFieldValueParser(generalInfo, {
      date: ["effectiveDateFrom", "effectiveDateTo"],
      string: ["secondaryPhoneExt", "primaryPhoneExt"],
    });
    if (generalInfo.displayAsMultiTenant) {
      otherFields.displayAsMultiTenant = ["multi"];
    } else {
      otherFields.displayAsMultiTenant = [];
    }
    if (generalInfo?.creditCard && generalInfo?.creditCard.length) {
      otherFields.CreditCardIds = generalInfo?.creditCard.map(
        (card) => card.masterId
      );
    }
    return { ...otherFields, logo };
  }, []);

  const parser = useCallback((generalInfo) => {
    const data = formFieldValueParser(generalInfo, {
      isDateToString: true,
      file: ["logo"],
      date: ["effectiveDateFrom", "effectiveDateTo"],
    });
    data.displayAsMultiTenant =
      data.displayAsMultiTenant?.indexOf("multi") > -1;
    return data;
  }, []);

  const onChangeLogo = useCallback(() => {
    form.setFieldsValue({ isLogoFileUpdated: true });
  }, [form]);

  const onRequestComplete = useCallback(({ response }) => {
    if (response) {
      Notification({
        message: SuccessMessages.BE_GENERAL_UPDATED_SUCCESSFULLY,
        success: true,
      });
    }
  }, []);

  const resetForm = useCallback(() => {
    form.resetFields();
  }, [form]);

  const onGetResponseComplete = useCallback(
    (generalInfo) => {
      setFormData({ ...generalInfo });
      resetForm();
    },
    [resetForm]
  );

  return (
    <div className="pannel back-pannel mr-top-20 mr-rt-16">
      <div className="pannel-body posi-relative">
        <Form
          form={form}
          section
          isUpdate
          getUrl={`${apiUrls.GET_BUSINESS_ENTITY_GENERAL}/${params.id}`}
          url={apiUrls.ADD_BUSINESS_ENTITY_GENERAL}
          contentType={contentType.MULTIPART}
          initialDataParser={initialDataParser}
          parser={parser}
          formId={`BUSINESS_ENTITY_GENERAL-${params.id}`}
          refetchId={`BUSINESS_ENTITY_GENERAL${params.id}`}
          onRequestComplete={onRequestComplete}
          name={`${formName.businessEntityForm}-${params.id}`}
          tabId={params.tabId}
          onGetResponseComplete={onGetResponseComplete}
          extraData={{
            businessEntityId: params.id,
            method: "post",
          }}
        >
          <Form.Section noOfColumns={2}>
            <Form.Column>
              <div className="label-container style-italics mr-bt-8 heading-text">
                {formData?.modifiedByName && (
                  <>
                    <label htmlFor="last-updated-by">Last Updated</label>
                    <span id="last-updated-by">{formData?.modifiedByName}</span>
                  </>
                )}
                {formData?.modifiedOn && (
                  <>
                    <label htmlFor="last-updated-on">On</label>
                  </>
                )}
              </div>
              <div style={{ display: "none" }}>
                <CheckBox name="isLogoFileUpdated" valuePropName="checked" />
              </div>
              <Input name="name" label="Name" maxValueLength={35} required />
              {/* <Select
                name="specialtyId"
                label={labels.get("labels.specialty")}
                enumName={enums.PROVIDER_SPECIALTY}
                labelSpan="10"
                inputSpan="14"
                optionParser={specialityOptionParser}
                required
              /> */}
              <div className="custom-uploader-file general-file-upload">
                {/* <Upload
                  accept=".png, .jpeg, .jpg, .gif"
                  label={labels.get("labels.logo")}
                  name="logo"
                  listType="picture"
                  multiple={false}
                  onChange={onChangeLogo}
                /> */}
              </div>
              <FormSelect
                name="sessionTimeout"
                label="TimeOut"
                labelSpan="10"
                inputSpan="14"
                options={minutesOptions}
                required
                disabled={params.entityType === "child"}
              />
              <div className="phone-group phone-group-validation phone-group-validation-width ">
                <PhoneNumberInput
                  label="Primary Phone"
                  id="7"
                  name="primaryPhone"
                  required
                  maxValueLength={10}
                  minValueLength={10}
                  labelSpan="10"
                  inputSpan="8"
                />
                <Input
                  label="Ext"
                  name="primaryPhoneExt"
                  numberOnly
                  labelSpan="9"
                  inputSpan="15"
                  maxValueLength={8}
                />
              </div>
              <div className="phone-group phone-group-validation phone-group-validation-width flex">
                <PhoneNumberInput
                  label="Secondary Phone"
                  id="7"
                  name="secondaryPhone"
                  required
                  maxValueLength={10}
                  minValueLength={10}
                  labelSpan="10"
                  inputSpan="8"
                />
                <Input
                  label="Ext"
                  name="secondaryPhoneExt"
                  numberOnly
                  labelSpan="9"
                  inputSpan="15"
                  maxValueLength={8}
                />
              </div>
              <DatePicker
                label="Effective From"
                name="effectiveDateFrom"
                id="10"
                inputSpan="14"
                labelSpan="10"
                required
              />
              <DatePicker
                label="Effective To"
                name="effectiveDateTo"
                id="10"
                inputSpan="14"
                labelSpan="10"
                required
                rules={[
                  ({ getFieldValue }) =>
                    toDateValidator(getFieldValue, "effectiveDateFrom"),
                ]}
                dependencies={["effectiveDateFrom"]}
              />
              <div className="mr-top-neg-8">
                <CheckBox
                  label="Display"
                  name="displayAsMultiTenant"
                  options={displayOptions}
                  component={CheckBox.Group}
                />
              </div>
            </Form.Column>
            <Form.Column rowTemplate="1fr auto">
              <div>
                <Input
                  label="address Line1"
                  name="addressLine1"
                  maxValueLength={50}
                  required
                />
                <AutoComplete
                  name="zip"
                  label="zip"
                  optionMaster="zipcode"
                  optionParser={zipOptionParser}
                  url={apiUrls.ZIP_LOOKUP}
                  labelSpan="10"
                  inputSpan="14"
                  onSelect={onZipCodeSelect}
                  required
                />
                <Input
                  disabled
                  label="city"
                  name="city"
                  required
                />
              </div>
              <div>
                {/* <Radio
                  name="billToLocation"
                  label={labels.get('labels.billToLocation')}
                  options={billToOptions}
                  labelSpan="10"
                  inputSpan="14"
                />
                <Radio
                  name="payToLocation"
                  label={labels.get('labels.payToLocation')}
                  options={payToOptions}
                  labelSpan="10"
                  inputSpan="14"
                /> */}
              </div>
            </Form.Column>
          </Form.Section>
          <Form.Section>
            <div className="group-btns">
              <Button
                id="exam_type_save"
                className="btn btn-success min-wt-86"
                type="submit"
              >
                Save
              </Button>
              <Button
                id="exam_type_cancel"
                className="btn min-wt-86"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </Form.Section>
        </Form>
      </div>
    </div>
  );
};

export default SampleForm;
