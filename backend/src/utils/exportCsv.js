// Xuat du lieu DataGrid ra file CSV (UTF-8 co BOM, Excel mo duoc tieng Viet), khong can them thu vien.
// Lay toan bo ban ghi khop bo loc/tim kiem hien tai cua luoi (khong chi trang dang xem).
import { notify } from "./api";

function stripHtml(value) {
  if (typeof value !== "string" || value.indexOf("<") < 0) return value;
  const doc = new DOMParser().parseFromString(value, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function formatValue(column, row) {
  let value = column.calculateCellValue ? column.calculateCellValue(row) : row[column.dataField];
  if (Array.isArray(value) && column.lookup && column.lookup.calculateCellValue) {
    // Cot nhieu gia tri (tag): doi tung ID sang ten.
    value = value.map((v) => {
      const name = column.lookup.calculateCellValue(v);
      return name === undefined || name === null ? v : name;
    });
  } else if (column.lookup && column.lookup.calculateCellValue && value !== undefined && value !== null) {
    value = column.lookup.calculateCellValue(value);
  }
  if (Array.isArray(value)) value = value.join("; ");
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (column.dataType === "date" || column.dataType === "datetime" || value instanceof Date) {
    const d = value instanceof Date ? value : new Date(value);
    if (!isNaN(d.getTime())) {
      const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      return column.dataType === "date" ? date : `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
  }
  return String(stripHtml(value));
}

function csvCell(text) {
  let s = String(text);
  // Chong chen cong thuc (CSV injection): du lieu do nguoi dan gui (ho ten, noi dung gop y...) bat dau bang
  // = + - @ tab CR thi Excel hieu la cong thuc; them dau ' de Excel coi la chu.
  if (/^[=+\-@\t\r]/.test(s) && !/^-\d+([.,]\d+)?$/.test(s)) s = "'" + s;
  return /[",\r\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function safeFileName(name) {
  return String(name || "danh-sach").replace(/[\\/:*?"<>|]+/g, "-").slice(0, 120);
}

// grid: instance DataGrid (e.component hoac ref.current.instance). fileName: khong can duoi .csv.
// options.columns: mang dataField muon xuat (mac dinh: cac cot dang hien, bo cot nut).
export async function exportGridToCsv(grid, fileName, options = {}) {
  try {
    let columns = grid.getVisibleColumns().filter((c) => c.dataField && c.type !== "buttons" && c.type !== "selection");
    if (options.columns) {
      columns = options.columns.map((f) => grid.columnOption(f) || { dataField: f, caption: f });
    }
    const ds = grid.getDataSource();
    const loadOptions = { filter: grid.getCombinedFilter(true) };
    const sort = ds && ds.sort ? ds.sort() : null;
    if (sort) loadOptions.sort = sort;
    const result = await ds.store().load(loadOptions);
    const rows = Array.isArray(result) ? result : result && result.data ? result.data : [];
    const lines = [columns.map((c) => csvCell(c.caption || c.dataField)).join(",")];
    for (const row of rows) {
      lines.push(columns.map((c) => csvCell(formatValue(c, row))).join(","));
    }
    const d = new Date();
    const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeFileName(fileName)}-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(`Đã xuất ${rows.length} dòng.`, "success");
  } catch (err) {
    notify("Không xuất được dữ liệu, vui lòng thử lại.", "error");
  }
}

// Nut "Xuat Excel" dat trong <Toolbar> cua DataGrid:
//   <Item location="after" widget="dxButton" options={exportButtonOptions(() => gridRef.current.instance, "gop-y")} />
export function exportButtonOptions(getGrid, fileName, options) {
  return {
    icon: "exportxlsx",
    text: "Xuất Excel",
    hint: "Xuất danh sách đang lọc ra file mở bằng Excel",
    onClick: () => exportGridToCsv(typeof getGrid === "function" ? getGrid() : getGrid, fileName, options),
  };
}
