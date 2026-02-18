import type { Category } from "../types/models";

export const defaultCategories: Category[] = [
  { id: "cash", name: "现金与转账", items: [] },
  { id: "housing", name: "房产相关", items: [] },
  { id: "car", name: "车辆相关", items: [] },
  { id: "jewelry", name: "金银珠宝", items: [] },
  { id: "wedding", name: "酒席与婚礼", items: [] },
  { id: "gifts", name: "礼品与人情", items: [] },
  { id: "setup", name: "生活配置", items: [] },
  { id: "custom", name: "其他自定义", items: [] },
];
