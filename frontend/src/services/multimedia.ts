import { APP_DATA_CONFIG } from '@/configs';
import axiosInstance, { getLang } from '.';

export const getMenuMultimedia = async () => {
  const res = await axiosInstance.get(`/MenuDetail?ID=${getLang() === 'vi' ? APP_DATA_CONFIG.MULTIMEDIA_MENU.VI : APP_DATA_CONFIG.MULTIMEDIA_MENU.EN}`);
  return res.data;
};

export const getPhotoAlbums = async (activePage: number, pageSize: number) => {
  const resNew = await axiosInstance.get(`PhotoAlbums?skip=${(activePage - 1) * pageSize}&take=${pageSize}&requireTotalCount=true`);
  return resNew.data;
};

export const getPhotoAlbum = async (id: string) => {
  const resNew = await axiosInstance.get(
    `PhotoAlbumInfo?ID=${id}`,
  );
  return resNew.data;
};

export const getVideoAlbums = async (activePage: number, pageSize: number) => {
  const resNew = await axiosInstance.get(`VideoAlbums?skip=${(activePage - 1) * pageSize}&take=${pageSize}&requireTotalCount=true`);
  return resNew.data;
};

export const getVideoAlbum = async (id: string) => {
  const resNew = await axiosInstance.get(`VideoAlbumInfo?ID=${id}`);
  return resNew.data;
};

export const getAudioAlbums = async (activePage: number, pageSize: number) => {
  const resNew = await axiosInstance.get(`AudioAlbums?skip=${(activePage - 1) * pageSize}&take=${pageSize}&requireTotalCount=true`);
  return resNew.data;
};

export const getAudioAlbum = async (id: string) => {
  const resNew = await axiosInstance.get(`AudioAlbumInfo?ID=${id}`);
  return resNew.data;
};

export const getAudiosByCategory = async (id: string) => {
  const resNew = await axiosInstance.get(`AudiosByChuyenMuc?ID=${id}`);
  return resNew.data;
};

export const getPhotosByCategory = async (id: string) => {
  const resNew = await axiosInstance.get(`PhotosByChuyenMuc?ID=${id}`);
  return resNew.data;
};

export const getVideosByCategory = async (id: string) => {
  const resNew = await axiosInstance.get(`VideosByChuyenMuc?ID=${id}`);
  return resNew.data;
};
