/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '.';

export const getScientificResearchs = async (activePage: number, pageSize: number) => {
  const res = await axiosInstance.get(`NghienCuuKhoaHocs?skip=${(activePage - 1) * pageSize}&take=${pageSize}&requireTotalCount=true`);

  return res?.data ?? [];
};

export const getScientificResearchDetail = async (id: string) => {
  const res = await axiosInstance.get(`/NghienCuuKhoaHocDetail?ID=${id}`);

  return res?.data?.data;
};

export const getScientificResearchDetailByoid = async (id: string) => {
  const res = await axiosInstance.get(`/NghienCuuKhoaHocDetailByOldID?ID=${id}`);

  return res?.data?.data;
};