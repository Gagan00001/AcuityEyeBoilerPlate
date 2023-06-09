function getFieldId(namePath, formName) {
  if (!namePath.length) return undefined;
  const mergedId = namePath.join('_');
  return formName ? ''.concat(formName, '_').concat(mergedId) : mergedId;
}

function toArray(candidate) {
  if (candidate === undefined || candidate === false) return [];
  return Array.isArray(candidate) ? candidate : [candidate];
}

export default function autoFocus(name, form) {
  const namePath = toArray(name);
  // eslint-disable-next-line no-underscore-dangle
  const fieldId = getFieldId(namePath, form && form.__INTERNAL__ && form.__INTERNAL__.name);
  const node = fieldId ? document.getElementById(fieldId) : null;
  if (node) {
    node.focus();
  }
}
