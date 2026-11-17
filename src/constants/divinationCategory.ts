import { ConfigService } from "../assets/lib/kookit-extra-browser.min";

// 配置键：典籍类型 → 书架映射（全局参数）
export const DIVINATION_CATEGORY_CONFIG_KEY = "divinationCategoryShelfMap";

export interface DivinationCategory {
  name: string;
  pinyin: string;
  shelves: string[];
}

export const DEFAULT_DIVINATION_CATEGORIES: DivinationCategory[] = [
  { name: "梅花", pinyin: "meihua", shelves: ["梅花"] },
  { name: "六爻", pinyin: "liuyao", shelves: ["六爻"] },
  { name: "奇门", pinyin: "qimen", shelves: ["奇门"] },
];

export function getDivinationCategories(): DivinationCategory[] {
  const raw = ConfigService.getReaderConfig(DIVINATION_CATEGORY_CONFIG_KEY);
  if (!raw) return DEFAULT_DIVINATION_CATEGORIES;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as DivinationCategory[];
    return DEFAULT_DIVINATION_CATEGORIES;
  } catch {
    return DEFAULT_DIVINATION_CATEGORIES;
  }
}

export function setDivinationCategories(
  categories: DivinationCategory[]
): void {
  ConfigService.setReaderConfig(
    DIVINATION_CATEGORY_CONFIG_KEY,
    JSON.stringify(categories)
  );
}

export function sortCategoriesByPinyin(
  categories: DivinationCategory[]
): DivinationCategory[] {
  return [...categories].sort((a, b) =>
    (a.pinyin || a.name).localeCompare(b.pinyin || b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );
}

// 返回某典籍类型下所有关联书架的书籍 key 集合（去重）
export function getCategoryBookKeys(
  category: DivinationCategory | undefined
): string[] {
  if (!category) return [];
  const shelfList = ConfigService.getAllMapConfig("shelfList") || {};
  const keys = new Set<string>();
  (category.shelves || []).forEach((shelf) => {
    const arr = shelfList[shelf];
    if (Array.isArray(arr)) {
      arr.forEach((key: string) => keys.add(key));
    }
  });
  return Array.from(keys);
}
