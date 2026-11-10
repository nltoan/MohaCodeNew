import { MINISTER_DATA_CONFIG, getConfigId } from "@/configs";
import axiosInstance, { getLang, getUrlPath } from ".";

export const getMinisterMenus = async () => {
    const prefixId = getConfigId(MINISTER_DATA_CONFIG.MENU, getLang());
    const res = await axiosInstance.get(getUrlPath(`/MenuDetail`, { ID: prefixId }));
    return res;
};