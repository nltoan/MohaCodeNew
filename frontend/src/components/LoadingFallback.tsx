export const LoadingFallback = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '240px',
        fontSize: '18px',
        color: '#666',
      }}
    >
      <div>Đang tải...</div>
    </div>
  );
};
