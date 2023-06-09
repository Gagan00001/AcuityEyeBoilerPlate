import moment from 'moment';

const getFilesData = (files = []) => {
  const fileArr = [];
  files.forEach((file) => { if (file.originFileObj) fileArr.push(file.originFileObj); });
  return fileArr;
};

const handleParseDate = (value, isDateToString) => {
  if (isDateToString) {
    return moment(value).toISOString();
  }
  return moment(value);
};

const getDateInString = (value) => moment(value).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

const getBoolInInt = (value) => (value ? 1 : 0);

const formFieldValuesParser = (values = {}, {
  date = [],
  int = [],
  bool = [],
  string = [],
  file = [],
  isDateToString,
  files = [],
  toBeRemove = [],
  time = [],
  dateInString = [],
  timeFormat = 'HH:mm',
} = {}) => {
  const filteredProviderData = {};
  Object.keys(values).forEach((key) => {
    const isDate = date.indexOf(key) > -1;
    const isDateInString = dateInString.indexOf(key) > -1;
    const isInt = int.indexOf(key) > -1;
    const isBool = bool.indexOf(key) > -1;
    const isString = string.indexOf(key) > -1;
    const isFile = file.indexOf(key) > -1;
    const isFiles = files.indexOf(key) > -1;
    const isRemove = toBeRemove.indexOf(key) > -1;
    const isTime = time.indexOf(key) > -1;

    if (values[key] || values[key] === 0 || values[key] === false) {
      if (isDate) {
        filteredProviderData[key] = handleParseDate(values[key], isDateToString);
      } else if (isDateInString) {
        filteredProviderData[key] = getDateInString(values[key]);
      } else if (isInt) {
        filteredProviderData[key] = parseInt(values[key], 10);
      } else if (isBool) {
        filteredProviderData[key] = getBoolInInt(values[key]);
      } else if (isString) {
        filteredProviderData[key] = (`${values[key]}`).trim();
      } else if (isFile && values[key]?.[0]?.originFileObj) {
        filteredProviderData[key] = values[key][0].originFileObj;
      } else if (isFiles) {
        filteredProviderData[key] = getFilesData(values[key]);
      } else if (isTime) {
        filteredProviderData[key] = moment.utc(values[key]).format(timeFormat);
      } else if (!(isDate || isInt || isBool || isString || isFile || isFiles || isRemove)) {
        filteredProviderData[key] = values[key];
      }
    }
  });
  return filteredProviderData;
};

export default formFieldValuesParser;
