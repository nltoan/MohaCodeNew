/* eslint-disable @typescript-eslint/no-explicit-any */
// ==========================================
// 1. DEFINITIONS (Định nghĩa kiểu dữ liệu)
// ==========================================

import type { HeaderMenu } from '@/layout';
import { APP_DATA_CONFIG } from './app-config';
import { getLang } from '@/services';

interface RawMenuItem {
  ID: number;
  TenMenu: string;
  URL: string;
  STT: number;
  IDMenuCha: number | null;
  Level: number;
  [key: string]: any;
}

const cleanEmptyChildren = (nodes: HeaderMenu[]): HeaderMenu[] => {
  return nodes.map((node) => {
    const newNode = { ...node };
    if (newNode.children && newNode.children.length > 0) {
      newNode.children = cleanEmptyChildren(newNode.children);
    } else {
      delete newNode.children;
    }
    return newNode;
  });
};

export const transformMenuData = (data: RawMenuItem[]): HeaderMenu[] => {
  const sortedData = [...data].sort((a, b) => a.STT - b.STT);
  const rootId = getLang() === 'vi' ? APP_DATA_CONFIG.MENU_ROOT.VI : APP_DATA_CONFIG.MENU_ROOT.EN;
  const nodeMap = new Map<number, HeaderMenu>();

  sortedData.forEach((item) => {
    nodeMap.set(item.ID, {
      id: item.ID.toString(),
      label: item.Level === 1 ? item.TenMenu.toUpperCase() : item.TenMenu, // Viết hoa level 1
      url: item.URL,
      children: [],
    });
  });

  sortedData.forEach((item) => {
    if (item.IDMenuCha && nodeMap.has(item.IDMenuCha)) {
      const parent = nodeMap.get(item.IDMenuCha);
      const child = nodeMap.get(item.ID);
      parent?.children?.push(child!);
    }
  });

  const rootNode = nodeMap.get(Number(rootId));
  if (!rootNode || !rootNode.children) return [];

  const firstItem = getLang() === 'vi' ? { label: 'TRANG CHỦ', url: '/' } : { label: 'HOME', url: '/' };
  return [firstItem, ...cleanEmptyChildren(rootNode.children)];
};
