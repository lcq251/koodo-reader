// 自定义排盘方法注册表（localStorage 持久化）
const STORAGE_KEY = "customDivinationMethods";

export interface CustomMethod {
  id: string;
  name: string;
  code: string;
}

export function getCustomMethods(): CustomMethod[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCustomMethod(method: CustomMethod): void {
  const list = getCustomMethods().filter((m) => m.id !== method.id);
  list.push(method);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function removeCustomMethod(id: string): void {
  const list = getCustomMethods().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
