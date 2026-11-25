import "devextreme/dist/css/dx.light.compact.css";
import { loadMessages, locale } from "devextreme/localization";
import * as viMessages from "devextreme/localization/messages/vi.json";
import "./contexts/i18n";
import ReactDOM from "react-dom/client";
import App from './App';
import viMessagesExtra from "./utils/viMessagesExtra";

// Ngon ngu DevExtreme ap dung 1 lan luc khoi dong (giu nguyen gia tri "lng" da luu, mac dinh "vi").
// viMessagesExtra nap sau de ghi de cac chuoi vi.json con de tieng Anh.
loadMessages(viMessages);
loadMessages(viMessagesExtra);
locale(localStorage.getItem("lng") || "vi");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
);
