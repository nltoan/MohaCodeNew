import { APP_DATA_CONFIG } from '@/configs';
import axiosInstance, { getLang, getUrlPath } from '.';
import { getIdFromSlug } from '@/utils/getSlugKey';

export const getMenuNew = async () => {
  const id = getLang() === 'vi' ? APP_DATA_CONFIG.LEFT_MENU_DETAIL.VI : APP_DATA_CONFIG.LEFT_MENU_DETAIL.EN;
  const res = await axiosInstance.get(getUrlPath(`/MenuDetail`, { ID: id }));
  if (res?.data?.childs) {
    const promises = res.data.childs.map(async (data: any) => {
      const cateID = getIdFromSlug(data.URL);
      const r = await axiosInstance.get(getUrlPath(`/ChuyenMucDetail`, { ID: cateID ?? '0', limitTopPost: 0 }));
      data.children = r.data?.childs;
    });
    await Promise.all(promises);
  }
  return res.data;
};

export const getTopPostNews = async (id: string, limitTopPost: number = 6) => {
  const res = await axiosInstance.get(getUrlPath(`ChuyenMucDetail`, { ID: id, limitTopPost }));
  return res.data;
};

export const getTopPostNewsByoid = async (id: string, limitTopPost: number = 6) => {
  const res = await axiosInstance.get(getUrlPath(`ChuyenMucDetailByoid`, { ID: id, limitTopPost }));
  return res.data;
};

export const getTopPostNewsBybtid = async (id: string, limitTopPost: number = 6) => {
  const res = await axiosInstance.get(getUrlPath(`ChuyenMucDetailBybtid`, { ID: id, limitTopPost }));
  return res.data;
};

export const getTopPostNewsBynqid = async (id: string, limitTopPost: number = 6) => {
  const res = await axiosInstance.get(getUrlPath(`ChuyenMucDetailBynqid`, { ID: id, limitTopPost }));
  return res.data;
};

export const getPostsByCategory = async (id: string, activePage: number, pageSize: number) => {
  const resNew = await axiosInstance.get(
    getUrlPath(`PostsByCategory`, {
      ID: id,
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: 'true',
    }),
  );
  return resNew.data;
};

export const getPostsByCategoryByoid = async (id: string, activePage: number, pageSize: number) => {
  const resNew = await axiosInstance.get(
    getUrlPath(`PostsByCategoryByoid`, {
      ID: id,
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: 'true',
    }),
  );
  return resNew.data;
};

export const getPostsByCategoryBybtid = async (id: string, activePage: number, pageSize: number) => {
  const resNew = await axiosInstance.get(
    getUrlPath(`PostsByCategoryBybtid`, {
      ID: id,
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: 'true',
    }),
  );
  return resNew.data;
};

export const getPostsByCategoryBynqid = async (id: string, activePage: number, pageSize: number) => {
  const resNew = await axiosInstance.get(
    getUrlPath(`PostsByCategoryBynqid`, {
      ID: id,
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: 'true',
    }),
  );
  return resNew.data;
};

export const getPostsByQuery = async (query: string) => {
  const resNew = await axiosInstance.get(query);
  return resNew.data;
}

export const getDetailPost = async (id: string) => {
  const res = await axiosInstance.get(getUrlPath(`PostDetail`, { ID: id }));
  return res.data;
};

export const getDetailPostByoid = async (id: string) => {
  const res = await axiosInstance.get(getUrlPath(`PostDetailByoid`, { ID: id }));
  return res.data;
};

export const getDetailPostBybtid = async (id: string) => {
  const res = await axiosInstance.get(getUrlPath(`PostDetailBybtid`, { ID: id }));
  return res.data;
};

export const getDetailPostBynqid = async (id: string) => {
  const res = await axiosInstance.get(getUrlPath(`PostDetailBynqid`, { ID: id }));
  return res.data;
};

export const getNotificationPost = async (id: string) => {
  const res = await axiosInstance.get(getUrlPath(`ThongBaoDetail`, { ID: id }));
  return res.data;
};

export const getRelatedPost = async (id: string, activePage: number, pageSize: number) => {
  const res = await axiosInstance.get(
    getUrlPath(`PostRelate`, {
      ID: id,
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: 'true',
    }),
  );
  return res.data;
};

export const getRelatedPostBybtid = async (id: string, activePage: number, pageSize: number) => {
  const res = await axiosInstance.get(
    getUrlPath(`PostRelateBybtid`, {
      ID: id,
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: 'true',
    }),
  );
  return res.data;
};

export const getRelatedPostByoid = async (id: string, activePage: number, pageSize: number) => {
  const res = await axiosInstance.get(
    getUrlPath(`PostRelateByoid`, {
      ID: id,
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: 'true',
    }),
  );
  return res.data;
};

export const getRelatedPostBynqid = async (id: string, activePage: number, pageSize: number) => {
  const res = await axiosInstance.get(
    getUrlPath(`PostRelateBynqid`, {
      ID: id,
      skip: (activePage - 1) * pageSize,
      take: pageSize,
      requireTotalCount: 'true',
    }),
  );
  return res.data;
};
