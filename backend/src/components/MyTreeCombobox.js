import { useRef, useState } from 'react';
import { TreeView } from 'devextreme-react/tree-view';
import DropDownBox from 'devextreme-react/drop-down-box';

export default function MyTreeCombobox({
  treeDataSource,
  keyExpr,
  parentIdExpr,
  selectionMode,
  displayExpr,
  defaultValue,
  onValueChanged,
}) {
  const [treeBoxValue, setTreeBoxValue] = useState(Number | []);
  const [isTreeBoxOpened, setIsTreeBoxOpened] = useState(false);
  const treeviewRef = useRef();

  const treeViewRender = () => {
    return (
      <TreeView
        dataSource={treeDataSource}
        ref={treeviewRef}
        dataStructure="plain"
        keyExpr={keyExpr}
        parentIdExpr={parentIdExpr}
        selectionMode={selectionMode}
        displayExpr={displayExpr}
        selectByClick={true}
        searchEnabled={true}
        selectNodesRecursive={false}
        expandNodesRecursive={true}
        onContentReady={(e) => {
          if(!treeBoxValue) return;
          if(Array.isArray(treeBoxValue)){
            treeBoxValue.forEach(value => {
              e.component.selectItem(value);
            });
          } else {
            e.component.selectItem(treeBoxValue);
          }
        }}
        onItemClick={(e) => {
          setIsTreeBoxOpened(false);
        }}
        onItemSelectionChanged={(e) => {
          setTreeBoxValue(e.component.getSelectedNodeKeys());
        }}
      />
    );
  };
  return (
    <>
      <DropDownBox
        deferRendering={false}
        value={treeBoxValue}
        defaultValue={treeBoxValue}
        opened={isTreeBoxOpened}
        valueExpr={keyExpr}
        displayExpr={displayExpr}
        placeholder="Chọn..."
        showClearButton={true}
        dataSource={treeDataSource}
        onInitialized={(e) => {
          setTreeBoxValue(defaultValue);
        }}
        onValueChanged={(e) => {
          setTreeBoxValue(e.value);
          if (!treeviewRef || !treeviewRef.current) return;

          if (!e.value) {
            treeviewRef.current.instance.unselectAll();
            onValueChanged(e);
          } else {
            treeviewRef.current.instance.selectItem(e.value);
            onValueChanged(e);
          }
        }}
        onOptionChanged={(e) => {
          if (e.name === "opened") {
            setIsTreeBoxOpened(e.value);
          }
        }}
        contentRender={treeViewRender}
      />
    </>
  );
}
