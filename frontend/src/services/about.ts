import axiosInstance from '.';

export const getLeadershipInfoDetail = async (id: string) => {
  const res = await axiosInstance.get(`ThongTinLanhDaoDetail?ID=${id}`);

  return res?.data?.data;
};

export const getOrganizationStructureDetail = async (id: string) => {
  const res = await axiosInstance.get(`/CoCauToChucDetail?ID=${id}`);

  return res?.data?.lanhdaos;
};

export const getOrganizationStructure = async (id: string) => {
  const res = await axiosInstance.get(`/CoCauToChuc?IDDVCha=${id}`);

  return res?.data?.data;
};

export const getHistory = async () => {
  const res = await axiosInstance.get(`/ThoiKyPhatTrien`);

  return res?.data?.data;
};

export const getLeadersByTerm = async () => {
  const res = await axiosInstance.get(`/LanhDaoThoiKy`);

  return res?.data?.data;
};
