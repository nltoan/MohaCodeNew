

export default function LayoutLogin({ title, children }) {
  return (
    <>
      <div
        className={"login-page"}
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        {children}
      </div>
    </>
  );
}
