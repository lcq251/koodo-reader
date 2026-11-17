// 断言算法：findings → conclusion（纯函数，配置驱动）
// 输入断语列表，按配置聚合出综合结论。改 assertion.config.json 即可调整行为。
import configData from '../data/assertion.config.json'

export const ASSERTION_CONFIG = configData

// 五层递进 stage 名（供面板分组展示）
export const STAGES = Object.fromEntries(configData.stages.map((s) => [s.id, s.name]))

// 展示层映射（从配置读取，替代 DuanYuPanel 硬编码）
export const VERDICT = configData.verdict            // polarity → 判词（原 POL_TXT）
export const LEVEL_CLASS = configData.levelClass     // 来源等级 → CSS class
export const VERDICT_CLASS = configData.verdictClass // 判词 → CSS class
export const NOTE_TEXT = configData.noteText         // 底部声明
export const EMPTY_TEXT = configData.emptyText       // 无匹配文案

// 断言算法核心：把匹配到的断语（findings）聚合为一个综合结论
export function assert(findings, config = ASSERTION_CONFIG) {
  const prio = (f) => {
    const i = config.sourcePriority.indexOf(f.sourceLevel)
    return i === -1 ? config.sourcePriority.length : i
  }

  // 1) 结论性规则：极性非「平」，且来源等级参与结论判定（明确规则 > 主题规则）
  const decisive = findings
    .filter((f) => f.polarity !== 'neutral' && config.decisiveLevels.includes(f.sourceLevel))
    .sort((a, b) => prio(a) - prio(b) || (a.stage || 2) - (b.stage || 2))

  // 2) 无结论性规则 → 平
  if (!decisive.length) {
    return { verdict: '平', summary: config.noDecisiveText, conflict: null, basis: [] }
  }

  // 3) 取最高来源等级的规则集
  const top = decisive[0].sourceLevel
  const topRules = decisive.filter((f) => f.sourceLevel === top)
  const pols = [...new Set(topRules.map((f) => f.polarity))]

  // 4) 正负并存 → 冲突并列（不可执一，不合成伪精确分数）
  if (pols.length > 1) {
    return {
      verdict: '吉凶互見',
      summary: config.conflictText,
      conflict: topRules.map((f) => `${f.label}（${config.verdict[f.polarity]}）`),
      basis: topRules.map((f) => f.label),
    }
  }

  // 5) 单一方向 → 判词 + 直引原文作结论
  return {
    verdict: config.verdict[pols[0]],
    summary: topRules[0].label,
    conflict: null,
    basis: topRules.map((f) => f.label),
  }
}
