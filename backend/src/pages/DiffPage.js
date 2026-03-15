import parse from "html-react-parser";
import HtmlDiff from "htmldiff-js";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from 'devextreme-react/button';
import { request } from "../utils/api";

export default function DiffPage({}) {
  const [searchParams] = useSearchParams();
  const ID = searchParams.get("ID");

  const [items, setItems] = useState();
  useEffect(() => {
    (async function () {
      if (ID == undefined) {
        return;
      }
      const items = await request(`/TinTuc_History/GetCompare?ID=${ID}`);
      setItems(items);
    })();
  }, []);
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Khác biệt</h3>
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
            title="Collapse"
          >
            <i className="fas fa-minus" />
          </button>
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="remove"
            title="Remove"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
      <div className="card-body" id="diffArea">
        <>
          {items && (
            <>
              <div className="col">
                {parse(
                  HtmlDiff.execute(
                    items.right ? items.right.NoiDung : "<p></p>",
                    items.left ? items.left.NoiDung : "<p></p>",
                  ),
                )}
              </div>
            </>
          )}
          <Button>
            Bỏ qua
          </Button>
        </>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
