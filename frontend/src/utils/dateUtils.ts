import dayjs from 'dayjs';

export const getCurrentDateVN = () => {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
  }).format(now);
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalizedWeekday}, ngày ${day}/${month}/${year}`;
};

export const vnFormatter = (date?: string, format: string = 'DD/MM/YYYY') => {
  if (!date) return '';

  return dayjs(date).format(format);
};

export const getVietnameseDate = (date:Date) => {
  const days = [
    "Chủ nhật", 
    "Thứ hai", 
    "Thứ ba", 
    "Thứ tư", 
    "Thứ năm", 
    "Thứ sáu", 
    "Thứ bảy"
  ];

  const thu = days[date.getDay()];
  const ngay = date.getDate();
  const thang = date.getMonth() + 1;
  const nam = date.getFullYear();

  return `${thu}, ngày ${ngay}/${thang}/${nam}`;
}
