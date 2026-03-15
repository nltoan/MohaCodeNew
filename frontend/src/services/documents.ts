/* eslint-disable @typescript-eslint/no-explicit-any */
import { APP_CONFIG } from '@/configs';
import axiosInstance from '.';

export const getDirectiveDocuments = async (id: string, activePage: number, pageSize: number) => {
  const res = await axiosInstance.get(`VanBanByLopVanBan?ID=${id}&skip=${(activePage - 1) * pageSize}&take=${pageSize}`);

  return res?.data?.data ?? [];
};

export const getDocumentArea = async () => {
  const res = await axiosInstance.get(`/LinhVuc`);

  return res?.data?.data;
};

export const getDocumentSigner = async () => {
  const res = await axiosInstance.get(`/VanBans_GetLookUpNguoiKy`);

  return res?.data;
};

export const getDocumentSignerTitle = async () => {
  const res = await axiosInstance.get(`/VanBans_GetLookUpChucDanh`);

  return res?.data;
};

export interface DocumentFilterParams {
  LopVanBanID?: string;
  trichYeu?: string;
  soKyHieu?: string;
  ngayBanHanhFrom?: string;
  ngayBanHanhTo?: string;
  ngayHieuLucFrom?: string;
  ngayHieuLucTo?: string;
  linhVucId?: string;
  nguoiKy?: string;
  chucDanhKy?: string;
  hinhThucVanBanId?: string;
  coQuanBanHanhId?: string;
  vanBan?: string;
}

const buildFilter = (conditions: Array<[string, string, any]>): any[] | undefined => {
  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];

  const result: any[] = [conditions[0]];

  for (let i = 1; i < conditions.length; i++) {
    result.push('and');
    result.push(conditions[i]);
  }

  return result;
};

export const getDocumentList = async (activePage: number, pageSize: number, filters: DocumentFilterParams = {}) => {
  const conditions: Array<any> = [];

  if (filters.trichYeu) {
    if (filters.soKyHieu) {
      conditions.push([['TrichYeu', 'contains', filters.trichYeu], 'or', ['SoKyHieu', 'contains', filters.soKyHieu]]);
    } else {
      conditions.push(['TrichYeu', 'contains', filters.trichYeu]);
    }
  }
  else if (filters.soKyHieu) {
    conditions.push(['SoKyHieu', 'contains', filters.soKyHieu]);
  }

  if (filters.ngayBanHanhFrom) {
    conditions.push(['NgayBanHanh', '>=', filters.ngayBanHanhFrom]);
  }

  if (filters.ngayBanHanhTo) {
    conditions.push(['NgayBanHanh', '<=', filters.ngayBanHanhTo]);
  }

  if (filters.ngayHieuLucFrom) {
    conditions.push(['NgayHieuLuc', '>=', filters.ngayHieuLucFrom]);
  }

  if (filters.ngayHieuLucTo) {
    conditions.push(['NgayHieuLuc', '<=', filters.ngayHieuLucTo]);
  }

  if (filters.linhVucId) {
    conditions.push(['LinhVucID', '=', filters.linhVucId]);
  }

  if (filters.nguoiKy) {
    conditions.push(['NguoiKy', '=', filters.nguoiKy]);
  }

  if (filters.chucDanhKy) {
    conditions.push(['ChucDanh', '=', filters.chucDanhKy]);
  }

  if (filters.hinhThucVanBanId) {
    conditions.push(['ID_HinhThucVanBan', '=', filters.hinhThucVanBanId]);
  }

  if (filters.coQuanBanHanhId) {
    conditions.push(['CoQuanBanHanhID', '=', filters.coQuanBanHanhId]);
  }

  if (filters.LopVanBanID) {
    conditions.push(['LopVanBanID', '=', filters.LopVanBanID]);
  }

  if (filters.vanBan) {
    conditions.push(['VanBan', '=', filters.vanBan]);
  }

  const filterArray = buildFilter(conditions);
  const filter = filterArray ? JSON.stringify(filterArray) : undefined;

  const res = await axiosInstance.get('VanBan', {
    params: {
      ...(filter && { filter }),
      lang: 'vi',
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: true,
    },
  });

  return res?.data;
};

export const getDraftLegalDocumentList = async (activePage: number, pageSize: number) => {
  const res = await axiosInstance.get('VanBanDuThao', {
    params: {
      lang: 'vi',
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: true,
    },
  });

  return res?.data;
};

export const getLegalDocumentForms = async () => {
  const res = await axiosInstance.get(`/HinhThucVanBan`);

  return res?.data?.data;
};

export const getLegalIssuingAuthorities = async () => {
  const res = await axiosInstance.get(`/CoQuanBanHanh`);

  return res?.data?.data;
};

export const getDocumentDetail = async (id: string) => {
  const res = await axiosInstance.get(`/VanBanDetail?ID=${id}`);

  return res?.data?.data;
};

export const getDocumentDetailByqpid = async (id: string) => {
  const res = await axiosInstance.get(`/VanBanDetailByOldQPPLID?ID=${id}`);

  return res?.data?.data;
};

export const getDocumentDetailBytbid = async (id: string) => {
  const res = await axiosInstance.get(`/VanBanDetailByOldTBID?ID=${id}`);

  return res?.data?.data;
};

export const getDocumentDetailBycdid = async (id: string) => {
  const res = await axiosInstance.get(`/VanBanDetailByOldCDID?ID=${id}`);

  return res?.data?.data;
};

export const getDraftLegalDocumentDetail = async (id: string) => {
  const res = await axiosInstance.get(`/VanBanDuThaoDetail?ID=${id}`);

  return res?.data?.data;
};

export const getDraftLegalDocumentDetailByoid = async (id: string) => {
  const res = await axiosInstance.get(`/VanBanDuThaoDetailByOldId?ID=${id}`);

  return res?.data?.data;
};

export const sendComment = async (id: string, data:any) => {
  try{
    data.recaptcha = localStorage.getItem(APP_CONFIG.recaptcha.key);
    data.IDVBDT =  id;
    const res = await axiosInstance.post(`/SendCommentVBDT`, data);
    return res?.data.Message;
  }
  catch(error:any){
    return error.response.data.Message;
  }
}