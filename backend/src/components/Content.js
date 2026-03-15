import { useWindowSize } from "../utils/windowResize"; 

export default function Content({ title, children }) {
  const size = useWindowSize();

  return (
    <div className="content-wrapper" style={{minHeight:size.height-59}}>
      <div className="content">
        <div className="container-fluid">{children}</div>
      </div>
    </div>
  );
}
