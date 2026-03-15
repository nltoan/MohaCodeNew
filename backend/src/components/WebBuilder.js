import "grapesjs/dist/css/grapes.min.css";
import "grapesjs/dist/grapes.min.js";

import grapesjs from "grapesjs";
import { useEffect } from "react";

export default function WebBuilder() {
  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      height: "100%",
      width: "100%",
      pageManager: true,
      assetManager: {
        custom: true,
        assets: [],
      },
      plugins: ["gjs-preset-newsletter"],
      deviceManager: {
        devices: [
          {
            id: "desktop",
            name: "Desktop",
            width: "",
          },
          {
            id: "tablet",
            name: "Tablet",
            width: "768px",
            widthMedia: "992px",
          },
          {
            id: "mobilePortrait",
            name: "Mobile portrait",
            width: "320px",
            widthMedia: "575px",
          },
        ],
      },
    });
  }, []);

  return (
    <div id="gjs" style={{ position: "absolute", top: 0, right: 0 }}></div>
  );
}
