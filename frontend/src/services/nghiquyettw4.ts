import { NghiQuyetTW4_DATA_CONFIG, getConfigId } from "@/configs";
import axiosInstance, { getLang, getUrlPath } from ".";

export const getMenus = async () => {
    const prefixId = getConfigId(NghiQuyetTW4_DATA_CONFIG.MENU, getLang());
    const res = await axiosInstance.get(getUrlPath(`/MenuDetail`, { ID: prefixId }));
    return res;
};