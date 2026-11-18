// 断言步骤配置：按占断方法（methodId）区分，每一步（五层递进）有权重/依据/书箱引用/代码/启用
import configData from "../data/assertion.config.json";

export interface AssertionBookRef {
  book: string;
  priority: number;
}

export interface AssertionStep {
  id: number;
  name: string;
  weight: number;
  enabled: boolean;
  basis: string;
  bookRefs: AssertionBookRef[];
  code: string;
}

const STORAGE_KEY = "divinationAssertionSteps";

// 默认五层递进（与 assertion.config.json 的 stages 一致）
const DEFAULT_STAGE_NAMES: string[] = configData.stages.map((s: any) => s.name);

// 生成某方法的默认步骤配置（权重随层级递减）
export function defaultSteps(): AssertionStep[] {
  return DEFAULT_STAGE_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    weight: 5 - i,
    enabled: true,
    basis: "",
    bookRefs: [],
    code: "",
  }));
}

function getStepsMap(): Record<string, AssertionStep[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getSteps(methodId: string): AssertionStep[] {
  const map = getStepsMap();
  return map[methodId] || defaultSteps();
}

export function saveSteps(methodId: string, steps: AssertionStep[]): void {
  const map = getStepsMap();
  map[methodId] = steps;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

// 加载每步自定义代码：code 定义 stepLogic(step, findings) 函数，返回贡献对象或 null
export function loadStepCode(
  code: string,
  step: AssertionStep,
  stepFindings: any[]
): any {
  if (!code || !code.trim()) return null;
  try {
    const factory = new Function(
      "step",
      "findings",
      `
      "use strict";
      ${code}
      if (typeof stepLogic !== 'function') return null;
      return stepLogic(step, findings);
      `
    );
    return factory(step, stepFindings);
  } catch (e) {
    console.error("断言步骤代码执行失败:", step.name, e);
    return null;
  }
}
