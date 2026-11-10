import dayjs from 'dayjs';

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
