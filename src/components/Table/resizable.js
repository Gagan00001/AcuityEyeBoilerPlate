
const getStyleVal = (elm, css) => (window.getComputedStyle(elm, null).getPropertyValue(css));
const paddingDiff = (col, horizontal) => {
  if (getStyleVal(col, 'box-sizing') === 'border-box') {
    return 0;
  }
  if (horizontal) {
    const padLeft = getStyleVal(col, 'padding-left');
    const padRight = getStyleVal(col, 'padding-right');
    return (parseInt(padLeft, 10) + parseInt(padRight, 10));
  }
  const padTop = getStyleVal(col, 'padding-top');
  const padBottom = getStyleVal(col, 'padding-bottom');
  return (parseInt(padTop, 10) + parseInt(padBottom, 10));
};

const setListeners = (div, horizontal) => {
  let pageX;
  let pageY;
  let curCol;
  let nxtCol;
  let curColWidth;
  let nxtColWidth;
  let curColHeight;
  let nxtColHeight;
  const event = new CustomEvent('resize');

  div.addEventListener('mousedown', (e) => {
    e.preventDefault();
    curCol = e.target.parentElement;
    nxtCol = curCol.nextElementSibling;
    pageX = e.pageX;
    pageY = e.pageY;

    const paddingHorizontal = paddingDiff(curCol, true);
    const paddingVertical = paddingDiff(curCol);

    curColWidth = curCol.offsetWidth - paddingHorizontal;
    curColHeight = curCol.offsetHeight - paddingVertical;
    if (nxtCol) nxtColWidth = nxtCol.offsetWidth - paddingHorizontal;
    if (nxtCol) nxtColHeight = nxtCol.offsetHeight - paddingVertical;
  });

  div.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  div.addEventListener('mouseout', (e) => {
    e.preventDefault();
    e.target.style.borderRight = '';
  });

  div.addEventListener('mouseup', () => {
    if (curCol) {
      curCol.dispatchEvent(event);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (curCol) {
      if (horizontal) {
        const diffX = e.pageX - pageX;
        if (nxtCol) nxtCol.style.width = `${nxtColWidth - (diffX)}px`;
        curCol.style.width = `${curColWidth + diffX}px`;
        curCol.style.maxWidth = `${curColWidth + diffX}px`;
      } else {
        const diffY = e.pageY - pageY;
        if (nxtCol) nxtCol.style.height = `${nxtColHeight - (diffY)}px`;
        curCol.style.height = `${curColHeight + diffY}px`;
      }
      curCol.dispatchEvent(event);
    }
  });

  document.addEventListener('mouseup', () => {
    curCol = undefined;
    nxtCol = undefined;
    pageX = undefined;
    nxtColWidth = undefined;
    curColWidth = undefined;
  });
};

const createDiv = (horizontal, height = 5, width = 5) => {
  const div = document.createElement('div');
  const divWidth = typeof width === 'string' ? width : `${width}px`;
  const divHeight = typeof height === 'string' ? height : `${height}px`;
  div.style.top = 0;
  div.style.right = 0;
  div.className = 'resize-custom';
  div.style.position = 'absolute';
  div.style.cursor = horizontal ? 'col-resize' : 'row-resize';
  div.style.userSelect = 'none';
  div.style.height = divHeight;
  div.style.width = divWidth;
  return div;
};

const createChildrenDiv = (cols, height, width, horizontal = true) => {
  const columns = cols;
  for (let i = 0; i < cols.length; i += 1) {
    const div = createDiv(horizontal, height, width);
    columns[i].appendChild(div);
    columns[i].style.position = 'relative';
    columns[i].style.class = 'resize-custom-class';
    setListeners(div, horizontal);
  }
};

const makeTableResizable = (table) => {
  const clonedTable = table;
  const row = clonedTable.getElementsByTagName('tr')[0];
  const cols = row ? row.children : undefined;
  if (!cols) return;
  clonedTable.style.overflow = 'hidden';
  const tableHeight = row.offsetHeight;
  createChildrenDiv(cols, tableHeight);
};

const makeGridResizable = (parentElement) => {
  const cols = parentElement ? parentElement.children : undefined;
  const clonedParentElement = parentElement;
  if (!cols) return;
  clonedParentElement.style.overflow = 'hidden';
  const height = clonedParentElement.offsetHeight;
  createChildrenDiv(cols, height);
};

const makePanelsResizable = (parentElement) => {
  const clonedParentElement = parentElement;
  clonedParentElement.style.overflow = 'hidden';
  createChildrenDiv([clonedParentElement], undefined, '100%', false);
};

export {
  makeTableResizable,
  makeGridResizable,
  makePanelsResizable,
};
