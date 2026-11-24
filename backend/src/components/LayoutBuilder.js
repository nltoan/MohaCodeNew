import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
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

function getComponents(data, arrRet) {
  (data || []).forEach((element) => {
    if (element.type === "component") {
      arrRet[element.id] = element;
    }
    if (element.children) {
      getComponents(element.children, arrRet);
    }
  });
}

function getComponentById(arr, id, type) {
  for (const element of arr || []) {
    if (element.type === type && element.id === id) {
      return element;
    }
    if (element.children) {
      let tmpEl = getComponentById(element.children, id, type);
      if (tmpEl) {
        return tmpEl;
      }
    }
  }
  return undefined;
}

// Bo cuc la du lieu JSON thuan -> sao chep sau de khong sua truc tiep state cu (React moi nhan ra thay doi).
function cloneLayout(layout) {
  return JSON.parse(JSON.stringify(layout || []));
}

const LayoutBuilder = ({ initialData, onChangeLayout }) => {
  const rawInitialLayout = initialData.layout;
  // Ban sao rieng: cac ham trong helpers (vd handleAddColumDataToRow) co the sua truc tiep hang,
  // khong duoc lam thay doi du lieu goc cua trang cha (mo lai sau khi bo thay doi phai thay ban cu).
  const initialLayout = useMemo(() => cloneLayout(rawInitialLayout), [rawInitialLayout]);
  const [layout, setLayout] = useState(initialLayout);
  // Tinh lai theo bo cuc hien tai: khoi vua keo vao hay vua di chuyen deu co du lieu (Title, Config...).
  const components = useMemo(() => {
    const comObj = {};
    getComponents(layout, comObj);
    return comObj;
  }, [layout]);

  const onChangeLayoutRef = useRef(onChangeLayout);
  onChangeLayoutRef.current = onChangeLayout;
  useEffect(() => {
    onChangeLayoutRef.current(layout);
  }, [layout]);

  useEffect(() => {
    setLayout(initialLayout);
  }, [initialLayout]);

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout],
  );

  const handleDrop = useCallback(
    (dropZone, item) => {

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      // sidebar into
      if (item.type === "sidebarItem") {
        // 1. Move sidebar item into page
        const newItem = {
          id: shortid.generate(),
          type: "component",
          refId: item.id,
          Title: item.Title,
          Code: item.Code,
          Path: item.Path,
          Config: item.Config,
        };
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem,
          ),
        );
        return;
      }

      // Giu nguyen moi thuoc tinh (Title, Config, class...) khi di chuyen phan tu da co.
      const existing = getComponentById(layout, item.id, item.type);
      const newItem = existing ? { ...existing } : { id: item.id, type: item.type };
      if (item.type === "column" && !existing) {
        newItem.children = item.children;
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
    [layout],
  );

  const updateElement = useCallback(
    (id, type, apply) => {
      const copy = cloneLayout(layout);
      const aEle = getComponentById(copy, id, type);
      if (aEle) {
        apply(aEle);
        setLayout(copy);
      }
    },
    [layout],
  );

  const handleRowChange = useCallback(
    (id, val) => updateElement(id, "row", (el) => { el.class = val; }),
    [updateElement],
  );
  const handleColumnChange = useCallback(
    (id, val) => updateElement(id, "column", (el) => { el.class = val; }),
    [updateElement],
  );

  const handleComponentChange = useCallback(
    (id, objVal) => updateElement(id, "component", (el) => { el.Config = JSON.stringify(objVal); }),
    [updateElement],
  );

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
        {Object.values(initialData.sidebars || []).map((sideBarItem) => (
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
