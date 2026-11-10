import "devextreme/dist/css/dx.light.compact.css";
import { loadMessages, locale } from "devextreme/localization";
import * as viMessages from "devextreme/localization/messages/vi.json";
import "./contexts/i18n";
import ReactDOM from "react-dom/client";
import App from './App';

// Ngon ngu DevExtreme ap dung 1 lan luc khoi dong (giu nguyen gia tri "lng" da luu, mac dinh "vi").
loadMessages(viMessages);
locale(localStorage.getItem("lng") || "vi");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
);
