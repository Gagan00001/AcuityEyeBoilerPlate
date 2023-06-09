# Form

Form is our generic component which handles our data in `add`, `get`, `update`, `delete` server request operations.  
On basis of various props `Form` handles data for different request. 

## Props
  - name (sting): This prop is the name of our form. We use this prop to render the changes done by user in  
    case of edit record/form, but doesn't updated on server. Kind of saved changes locally.  
  
  - size (sting): Props used by `antd` to give the size of it's components. Values of size is `small | middle | large`.  
  
  - formItemLayout (object): This property defines the space of `span`/`space` take by label and fields.  
    E.g: {  
       labelCol: { span: 7 },  
       wrapperCol: { span: 20 },  
    }  
    Space take by `label` will be 7 and by `field` will be 20`.  
    These are default values.  

  - noOfColumns (number): No. of columns of fields in design.  

  - sectionMinWidth (number): Minimum width of an section used by `Form.Section`.  

  - children (component): This props is the set of elements we use to get data from user `(Our form components)`.  

  - onFinish (function): This function we use when we want to handle data on submit by ourself and do not want to handle by    form internally.`(optional)`  

  - onFinishFailed (function): This function will run when user doesn't fill the required fields of form child elements.
    `(optional)`  

  - section (boolean): This props is required when we wrap/use our child elements in `<Form.Section />`  as children. Use of   this prop is for design purpose only.  

  - form (object): This prop is the instance of `Form` import from `antd` library. With the help of this prop we handle set    initialValues in form when we switch to another record. `form` instance of each form should be different.  

  - formDataToStore (function): This function prop comes from `mapDispatchToProps`, which will trigger every time user make
    some changes on record but not save them to server. This will maintain the changes locally.  

  - formId (string): This prop is also required. We store data in redux in `formId` key. And with this key we access data
    from redux.  

  - url (string): This props is used when we want to perform `add` or `update` operation for record. `url` is `api route` of   server. In case of `update` operation `url` also contains the current record id on which update will perform.  

  - tabId, // added to remove warning from console
  - isUpdate (boolean): This prop is use to tell form that current mode of form is add or edit. In case of `add` we don't   
    use `isUpdate` prop. But during `update` operation this props must be true

  - onAddEntity (function): This function prop comes from `mapDispatchToProps`, which will trigger when we request to `add`
    operation to save record.  

  - onGetEntity (function): This function prop comes from `mapDispatchToProps`, which will trigger once when we edit any
    record.  Main task of this function is to get the current record data.  

  - onUpdateEntity (function): This function comes from `mapDispatchToProps`, which will trigger when we update any record.  

  - parser (function): This function will trigger when submit the form data. This function will parse our data object to       the format required on server and remove the undefined records.

  - onRequestComplete (function): This function is required and it will be triggered when any operation completes  
    successfully.  

  - error (object): This prop contain the errors occur during server request.  

  - loading (boolean): This prop used to trigger the `Loader` component of form. This is used by redux on different steps of   operations.  

  - response (object): This props is used when we get the `response` of any operation we perform.  

  - payload (object): This property use to store data in redux in case of fake true.  

  - getUrl (string): This is the `api route` with contain record id with it. This url uses to get the data from server in
    case of edit record.  

  - initialDataParser (function): This function is required in case of edit record. This will trigger once we get data from
    server. This will parse the response from server as the format required by our form elements.  

  - currentFormData (object): This object comes from `mapStateToProps`. And this object contain response of data we get on
    edit record.  

  - clearCurrentFormData (function): This function prop comes from `mapDispatchToProps`, which will clear the record from
    redux on the basic of `formId`.  

  - initialData (object): This prop we used if we want to assign an initial value to our form elements.  

  - contentType (string): This props is used when we want to handle content type other than `application/json`.  
    For e.g... If we want to add data as  `multipart/form-data` then we add the pass this prop with content type.  

  - fake (boolean): This prop is used for differentiate between `api` or `static` (local operations) operations.
  - listId (string): ,
  - editKey: This prop is the `id` of the record we access. We don't have to pass it. It is by default uses `params.id` as
    it's value. We need to pass this prop only when the key of current record other than `id`.  

  - onGetResponseComplete (function): This function will trigger when initial values assign to child elements. We use this
    function if we want to get the record in case of edit/get record.`(optional)`     

  - otherProps (object): This is the other props which we didn't define in our custom `Form` component. But, we can use
    those props by other props. These props will be directly assign to `Form` and can be use on different events.  

## render
    This will render the child elements with all initialValues.


# Form.Item

`Form.Item` is important part of our form. If we use any component as child of `Form` then we need to wrap that child
component with `Form.Item`. All events or data handling in child elements captured by `Form` due to `Form.Item`.  
Without it `Form` would not perform any validations or data events on child components.  
This provides us the feature of rules of validation.  

### Note: 
  > Following props are used in the components describe after `Form.Item`.

## Props
- name (string): This prop is required for `Form`. If any `Form.Item` is not having an `name` prop then no events of `Form`
  will work/applied on element wrapped with `Form.Item` without name prop.  

- rules (array): With this prop we can apply different type of validations/rules. For more help read `Antd` online.  

- required (boolean): This prop use for apply required validation on an field. i.e. that field can't be empty.  

- otherProps (object): This prop contain all the other props which we can assign to `Form.Item` that are not listed in props
  list.   

## render

    This will render the elements/components with some additional benefits of rules, validations and more.


# AutoComplete
Description  AutoComplete is our generic component which is a select box used to fetch data from url and to auto populate other fields based on the data.  

## Props
- label (string) -  label of the field.
- name (string) -  name of the field.
- required (boolean) - specifies whether field must be filled or not.
- placeholder (string) - default text for the field.
- tabIndex (string) - specifies tab order.
- labelSpan (string) - specifies label size.
- inputSpan (string) - specifies input field size.
- url (string) - web address to fetch data.
- onSelect (function) - by clicking on  option this action will be fired.  

## render
    It will render input field with given props.  

# CheckBox
Description  CheckBox is our generic component which is a square box that is ticked (checked) when activated.  

## Props
- children (string) - component needed to wrap with checkbox.
- name (string) - name of the field.
- className (string) - class name for styling.
- label (string) - label of the field.
- labelSpan (string) - specifies label size.
- inputSpan (string) - specifies input field size.
- required (boolean) - specifies whether field must be filled or not.
- checked (boolean) - specifies whether field is active or not.
- id (string) - unique id of field.  

## render
    It will render input field with given props.  

# DatePicker

Description  The DatePicker is tied to a standard form input field. Focus on the input to open an interactive calendar in a small overlay.  

## Props
- label (string) - label of the field.
- name (string) - name of the field.
- showTime (string) - to provide an additional time selection.
- dateFormat (string) - format of date.
- tabIndex (string) - specifies tab order.
- required (boolean) - specifies whether field must be filled or not.
- rules (array) - rules for field validation.
- onChange (function) - a `callback function`, can be executed when the selected date or time is changing.
- value (string) - value of the field.
- className (string) - name of class for styling.
- inputSpan (string) - specifies input filed size.
- labelSpan (string) - specifies label size.
- disabled (boolean) - determine whether the DatePicker is disabled or not.
- id (string) - unique id of field.
- disabledDate (boolean) - specify the date that cannot be selected  

## render
    It will render input field with given props.  

# Input
Description  The Input is tied to a standard form input field.  

## Props
- label (string) - label of the field.
- value (string) - value of the field.
- name (string) - name of the field.
- required (boolean) - specifies whether field must be filled or not.
- tabIndex (string) - specifies tab order.
- labelSpan (string) - specifies label size.
- inputSpan (string) - specifies input field size.
- rules (array) - rules for field validation.
- disabled (boolean) - determine whether the DatePicker is disabled or not.
- id (string) - unique id of field.
- charOnly (boolean)- validate to character only.
- maxValueLength (string) - validate length to max value.
- minValueLength (string) - validate length to min value.
- alphaNumericOnly (bring) - validate to alphanumeric only
- numberOnly (boolean) - validate to number only.

## render
    It will render input field with given props.

# Radio
Description  The Radio is tied to a standard form input field used to select a single state from multiple options.

## Props
- options (array) - multiple option for field.
- onChange (function) - a `callback function`, can be executed when the selected date or time is changing.
- className (string) - class name for styling.
- value (string) - value of the field.
- label (string) -  label of the field.
- name (string) - name of the field.
- inputSpan (string) - specifies input field size.
- labelSpan (string) - specifies label size.
- required (boolean) - specifies whether field must be filled or not.
- rules (array) - rules for field validation.
- id (string) - unique id of field.

## render
    It will render input field with given props.

# RadioGroup
Description  The RadioGroup is tied to a standard form input field used to select a single state from multiple options.

## Props
- tabList (array) - array of options. 
- onChange (function) - a `callback function`, can be executed when the selected date or time is changing.
- value (string) - value of the field.

## render
    It will render input field with given props.

# SelectBox
Description  The SelectBox is tied to a standard form input field used to select value from options..

## Props
- options (array) -  multiple option for field.
- selectedOption (function) - on change this function will execute.
- allowClear (boolean) - show clear button.
- label (string) - label of the field.
- name (string) - name of the field.
- value (string) - value of the field.
- required (boolean) - specifies whether field must be filled or not.
- onChange (function) - a `callback function`, can be executed when the selected date or time is changing.
- rules (array) - rules for field validation.
- placeholder (string) - default text for the field.
- tabIndex (string) - specifies tab order.
- labelSpan (string) - specifies label size.
- inputSpan (string) - specifies input field size.
- loading (boolean) - indicate loading state.

## render
    It will render input field with given props.