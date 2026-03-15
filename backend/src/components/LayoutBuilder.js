import React, { useState, useCallback, useEffect } from "react";
import DropZone from "./Layout/DropZone";
import TrashDropZone from "./Layout/TrashDropZone";
import SideBarItem from "./Layout/SideBarItem";
import Row from "./Layout/Row";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout
} from "../utils/helpers";
import shortid from "shortid";

const LayoutBuilder = ({ initialData, onChangeLayout }) => {
  const initialLayout = initialData.layout;
  let comObj = {};
  getComponents(initialLayout, comObj);
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(comObj);

  useEffect(() => {
    onChangeLayout(layout);
  }, [layout]);

  useEffect(() => {
    setLayout(initialData.layout);
  }, [initialLayout]);

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout],
  );
  
  function getComponents(data, arrRet) {
    data.forEach((element) => {
      if (element.type == "component") {
        arrRet[element.id] = element;
      }
      if (element.children) {
        getComponents(element.children, arrRet);
      }
    });
  }

  const handleDrop = useCallback(
    (dropZone, item) => {
      console.log("dropZone", dropZone);
      console.log("item", item);

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type };
      if (item.type === "column") {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type == "sidebarItem") {
        // 1. Move sidebar item into page
        const newComponent = {
          id: shortid.generate(),
          Title: item.Title,
        };
        const newItem = {
          id: newComponent.id,
          type: "component",
          refId: item.id,
          Title: item.Title,
          Code: item.Code,
          Path: item.Path,
          Config: item.Config,
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent,
        });
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem,
          ),
        );
        console.log(components);
        console.log(layout);
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath),
          );
          return;
        }

        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem,
          ),
        );
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem,
        ),
      );
    },
    [layout, components],
  );
  function getComponentById(arr, id, type) {
    for (const element of arr) {
      if (element.type == type && element.id == id) {
        return element;
      }
      if (element.children) {
        let tmpEl = getComponentById(element.children, id, type);
        if (tmpEl) {
          return tmpEl;
        }
      }
    }
  }
  const handleRowChange = useCallback((id, val) => {
    let aEle = getComponentById(layout, id, "row");
    if (aEle) {
      aEle.class = val;
      setLayout(layout);
    }
  });
  const handleColumnChange = useCallback((id, val) => {
    let aEle = getComponentById(layout, id, "column");
    if (aEle) {
      aEle.class = val;
      setLayout(layout);
    }
  });

  const handleComponentChange = useCallback((id, objVal) => {
    let aEle = getComponentById(layout, id, "component");
    if (aEle) {
      aEle.Config = JSON.stringify(objVal);
      setLayout(layout);
    }
  });

  const renderRow = (row, currentPath) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        handleRowChange={handleRowChange}
        handleColumnChange={handleColumnChange}
        handleComponentChange={handleComponentChange}
        components={components}
        path={currentPath}
      />
    );
  };

  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className="body">
      <div className="sideBar">
        {Object.values(initialData.sidebars).map((sideBarItem, index) => (
          <SideBarItem key={sideBarItem.id} data={sideBarItem} />
        ))}
      </div>
      <div className="pageContainer">
        <div className="page">
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length,
                  }}
                  onDrop={handleDrop}
                  path={currentPath}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length,
            }}
            onDrop={handleDrop}
            isLast
          />
        </div>

        <TrashDropZone
          data={{
            layout,
          }}
          onDrop={handleDropToTrashBin}
        />
      </div>
    </div>
  );
};
export default LayoutBuilder;
