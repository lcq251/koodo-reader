// 断言算法：findings → conclusion（纯函数，配置驱动）
// 输入断语列表，按配置聚合出综合结论。改 assertion.config.json 即可调整行为。
import configData from '../data/assertion.config.json'
import { getSteps, loadStepCode } from './assertionSteps'

export const ASSERTION_CONFIG = configData

// 运行时配置覆盖（断言配置界面写入 localStorage，优先于静态 config）
export function getAssertionConfig() {
  try {
    const override = JSON.parse(
      localStorage.getItem('assertionConfigOverride') || 'null'
    )
    if (override && typeof override === 'object') {
      return { ...configData, ...override }
    }
  } catch (e) {
    // 忽略解析错误，回退静态配置
  }
  return configData
}

// 五层递进 stage 名（供面板分组展示）
export const STAGES = Object.fromEntries(configData.stages.map((s) => [s.id, s.name]))

// 展示层映射（从配置读取，替代 DuanYuPanel 硬编码）
export const VERDICT = configData.verdict            // polarity → 判词（原 POL_TXT）
export const LEVEL_CLASS = configData.levelClass     // 来源等级 → CSS class
export const VERDICT_CLASS = configData.verdictClass // 判词 → CSS class
export const NOTE_TEXT = configData.noteText         // 底部声明
export const EMPTY_TEXT = configData.emptyText       // 无匹配文案

// 断言算法核心：把匹配到的断语（findings）聚合为一个综合结论
// methodId 可选：传入时读取该方法的每步配置（权重/启用/自定义代码）
export function assert(findings, config = getAssertionConfig(), methodId = null) {
  const steps = methodId ? getSteps(methodId) : null

  const prio = (f) => {
    const i = config.sourcePriority.indexOf(f.sourceLevel)
    return i === -1 ? config.sourcePriority.length : i
  }

  // 每步权重（支持自定义代码覆盖）
  const stepWeight = (f) => {
    if (!steps) return 0
    const step = steps.find((s) => s.id === f.stage)
    if (!step) return 0
    if (step.code && step.code.trim()) {
      const stepFindings = findings.filter((x) => x.stage === f.stage)
      const custom = loadStepCode(step.code, step, stepFindings)
      if (custom && custom.weight != null) return custom.weight
    }
    return step.weight || 0
  }

  // 1) 过滤禁用步
  const effective = steps
    ? findings.filter((f) => {
        const step = steps.find((s) => s.id === f.stage)
        return step ? step.enabled : true
      })
    : findings

  // 2) 结论性规则：极性非「平」，且来源等级参与结论判定；按来源优先级 + 每步权重排序
  const decisive = effective
    .filter(
      (f) =>
        f.polarity !== 'neutral' &&
        config.decisiveLevels.includes(f.sourceLevel)
    )
    .sort(
      (a, b) =>
        prio(a) - prio(b) ||
        stepWeight(b) - stepWeight(a) ||
        (a.stage || 2) - (b.stage || 2)
    )

  // 3) 无结论性规则 → 平
  if (!decisive.length) {
    return { verdict: '平', summary: config.noDecisiveText, conflict: null, basis: [] }
  }

  // 4) 取最高来源等级的规则集
  const top = decisive[0].sourceLevel
  const topRules = decisive.filter((f) => f.sourceLevel === top)
  const pols = [...new Set(topRules.map((f) => f.polarity))]

  // 5) 正负并存 → 冲突并列（不可执一，不合成伪精确分数）
  if (pols.length > 1) {
    return {
      verdict: '吉凶互見',
      summary: config.conflictText,
      conflict: topRules.map((f) => `${f.label}（${config.verdict[f.polarity]}）`),
      basis: topRules.map((f) => f.label),
    }
  }

  // 6) 单一方向 → 判词 + 直引原文作结论
  return {
    verdict: config.verdict[pols[0]],
    summary: topRules[0].label,
    conflict: null,
    basis: topRules.map((f) => f.label),
  }
}
