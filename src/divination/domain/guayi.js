// 卦义维度（L2 事象层补充）：从《诸卦反对性情》提取卦名性情
import zhexingData from '../data/zhexing.classic-v1.json'
import { tradify } from '../core/tradify.js'

// HEX64 简体卦名 → zhexing 标准名 归一
const NORMALIZE = { 遁: '遯' }

// 从 fullName（如「泽火革」）提取卦名（如「革」）；八纯卦「乾为天」→「乾」
function guaName(fullName) {
  if (fullName.includes('为')) return fullName[0]
  return fullName.slice(2)
}

// 卦名 → 诸卦性情原文句（含行号溯源）
export function guayiOf(fullName) {
  const gn = guaName(fullName)
  const std = tradify(NORMALIZE[gn] || gn)
  const hit = zhexingData.lines.find((l) => l.guas.includes(std))
  return hit ? { gua: std, text: hit.text, line: hit.line, refs: [`meihua.txt:${hit.line}`] } : null
}
