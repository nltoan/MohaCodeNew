import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Lookup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function User_Account() {
  const dataSourceOptions = createCustomStore(
    {
      loadUrl: `${window.env.REACT_APP_API_URL}/User_Account/GetLive`,
      insertUrl: `${window.env.REACT_APP_API_URL}/User_Account/Post`,
      updateUrl: `${window.env.REACT_APP_API_URL}/User_Account/Put`,
      deleteUrl: `${window.env.REACT_APP_API_URL}/User_Account/Delete`,
    },
    "UserID",
  );
  const dataSourceRoleOptions = createLookupStore("Roles");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý Tài khoản</h3>
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
      <div className="card-body">
        <DataGrid
          dataSource={dataSourceOptions}
          remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          height="calc(100vh - 190px)"
        >
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="TenDangKy" />
              <Item dataField="TenTruyCap" disabled={true} />
              <Item dataField="MatKhau" />
              <Item dataField="DiaChi" />
              <Item dataField="SoDienThoai" />
              <Item dataField="EmailAddress" />
              <Item dataField="SoCMND" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="PasswordQuestion" visible={false} />
              <Item dataField="PasswordAnswer" visible={false} />
              <Item dataField="IDDVC_DonViDangKy" visible={false} />
              <Item dataField="RoleId" />
              <Item dataField="IsTwoFA" />
              <Item dataField="IsReceiveEmail" />
            </Form>
          </Editing>
          <Column dataField="UserID" dataType="string" caption="ID" />
          <Column
            dataField="TenDangKy"
            dataType="string"
            caption="Tên đăng ký"
          />
          <Column
            dataField="TenTruyCap"
            dataType="string"
            caption="Tên đăng nhập"
          />
          <Column
            dataField="MatKhau"
            dataType="string"
            caption="Mật khẩu"
            visible={false}
          />
          <Column dataField="DiaChi" dataType="string" caption="Địa chỉ" />
          <Column
            dataField="SoDienThoai"
            dataType="string"
            caption="Số điện thoại"
          />
          <Column dataField="EmailAddress" dataType="string" caption="Email" />
          <Column dataField="SoCMND" dataType="string" caption="Số CMND" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: "locked", Name: "Đã khóa" },
                { Val: "inactive", Name: "Chưa kích hoạt" },
                { Val: "active", Name: "Kích hoạt" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column dataField="IsTwoFA" dataType="string" caption="Kích hoạt 2FA">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không kích hoạt" },
                { Val: 1, Name: "Kích hoạt" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="IsReceiveEmail"
            dataType="string"
            caption="Nhận email thông báo thay đổi tin tức"
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không nhận" },
                { Val: 1, Name: "Nhận" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="PasswordQuestion"
            dataType="string"
            caption="Câu hỏi mật khẩu"
            visible={false}
          />
          <Column
            dataField="PasswordAnswer"
            dataType="string"
            caption="Câu trả lời"
            visible={false}
          />
          <Column
            dataField="IDDVC_DonViDangKy"
            dataType="string"
            caption="Đơn vị đăng ký"
            visible={false}
          />
          <Column
            dataField="RoleId"
            dataType="number"
            caption="Loại tài khoản"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceRoleOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="Description"
            />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
