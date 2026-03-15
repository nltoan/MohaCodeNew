import { NghiQuyetTW4_DATA_CONFIG } from "@/configs";
import axiosInstance, { getLang, getUrlPath } from ".";

const isLanguageVN = getLang() === "vi";

export const getCtxAppConfig = async () => {
    return await axiosInstance.get(getUrlPath('/menu'));
};

export const getMenus = async () => {
    const prefixId = isLanguageVN ? NghiQuyetTW4_DATA_CONFIG.MENU.VI : NghiQuyetTW4_DATA_CONFIG.MENU.EN;
    const res = await axiosInstance.get(getUrlPath(`/MenuDetail`, { ID: prefixId }));
    return res;
};