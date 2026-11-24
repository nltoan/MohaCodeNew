// Anh xem truoc cua o tai anh: khi dang tai len thi lam mo anh cu va hien "Đang tải lên…".
export default function UploadPreview({ src, uploading, width = 100 }) {
  if (!src && !uploading) return null;
  return (
    <div style={{ position: "relative", display: "inline-block", minWidth: width, minHeight: uploading && !src ? 40 : undefined }}>
      {src && (
        <img
          className="uploadedImage"
          width={width}
          src={src}
          alt="Ảnh xem trước"
          style={{ opacity: uploading ? 0.35 : 1, transition: "opacity .2s" }}
        />
      )}
      {uploading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
            color: "#333",
            textAlign: "center",
          }}
        >
          Đang tải lên…
        </div>
      )}
    </div>
  );
}
