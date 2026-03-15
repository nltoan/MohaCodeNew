import type { AxiosResponse } from 'axios';
import axiosInstance, { getUrlPath, getUrlPathWithLang, axiosPhanAnhExternalInstance, getLang } from '.';

export interface NewsData {
  ID: number;
  TieuDe: string;
  MoTa: string | null;
  NgayXuatBan: string;
  TenAnhDaiDien: string;
  AnhDaiDienUrl: string;
}

export interface NewsCategoryItem {
  TopPost?: NewsData;
  TenChuyenMuc: string;
  ID: string;
}

export const getCtxAppConfig = async () => {
  return await axiosInstance.get(getUrlPath('/menu'));
};

export const getBoxHot = async () => {
  return await axiosInstance.get(getUrlPathWithLang('/BoxHot'));
};

export const getBox8News = async (id: string): Promise<NewsCategoryItem[]> => {
  const res = await axiosInstance.get(`/Box8News?ID=${id}`);
  return res.data.subCates;
};

export const getNotify = async () => {
  return await axiosInstance.get(getUrlPath('/BoxAnnouncement'));
};

export const getEvents = async () => {
  return await axiosInstance.get(getUrlPath('/SuKienHoiThao'));
};
export interface BannerItem {
  ID: number;
  TenBanner: string;
  ID_File: number;
  NgayXuatBan: string;
  NgayHetHieuLuc: string | null;
  NgayTao: string;
  URL: string;
  LuotTruyCap: number | null;
  AnhBanner: string;
  AnhBannerUrl: string;
}

export const getHomeBanner = async (bannerId: string | number): Promise<AxiosResponse<{ data: BannerItem[] }>> => {
  return await axiosInstance.get(`/BannerByViTri?ID_ViTri=${bannerId}`);
};

export const getDocumentLegal = async () => {
  return await axiosInstance.get(getUrlPathWithLang('/BoxVBPL', { limit: 7}));
};

export const getMedias = async () => {
  return await axiosInstance.get(getUrlPathWithLang('/BoxMedia'));
};

export const getPhanAnhKienNghiCuTri = async () => {
  return await axiosInstance.get('getKNCT')
}

export const getPhanAnhKienNghi = async () => {
  return await axiosInstance.get('getPAKN');
}

export const getPhanAnhKienNghiCuTri1 = async () => {
  return await axiosPhanAnhExternalInstance.get('getListKNCT');
}

export const getPhanAnhKienNghi1 = async () => {
  return await axiosPhanAnhExternalInstance.get('getList');
}

// export const Search?keyword=testkeyword&lang=vi&skip=0&take=8&requireTotalCount=true

export const searchInformation = async (keyword: string, activePage: number, pageSize: number) => {
  if(keyword === '')
    return [];
    // Define your sort object
    const sortOption = [
        { selector: "TieuDe", desc: false } // false for ASC, true for DESC
    ];
    const sortParam = JSON.stringify(sortOption);
    const res = await axiosInstance.get(`Search`, {
        params: {
            keyword: keyword,
            lang: getLang(),
            sort: sortParam,
            skip: (activePage - 1) * pageSize,
            take: pageSize,
            requireTotalCount: true
        }
    });
  return res?.data ?? [];
};