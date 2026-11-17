// 断语引擎（L3）：断语插件注册表 + 共享工具（溯源 / 冲突检测 / 常量）
// 文本来源分层：L0 原文 → L1 段落索引 → L2 规则 → L3 断语
// 每方法一个 quote 插件（methods/<方法>/quote.js），此处按 methodId 调度。
import meihuaText from '../data/texts/meihua.txt?raw'
import zhouyiText from '../data/texts/zhouyi.txt?raw'
import MeihuaQuote from '../methods/meihua/quote.js'
import ZhouyiQuote from '../methods/zhouyi/quote.js'

const MEIHUA_LINES = meihuaText.split('\n')
const ZHOUYI_LINES = zhouyiText.split('\n')

export const INTENTS = [
  { id: 'general', name: '一般事項' },
  { id: 'relationship', name: '婚姻' },
  { id: 'wealth', name: '求財' },
  { id: 'house', name: '家宅' },
  { id: 'travel', name: '出行' },
  { id: 'weather', name: '天時' },
]

export const SOURCE_LEVELS = ['明確規則', '主題規則', '案例', '象意']

// 解析 "file:start-end" → 原文段落
export function lookupSource(ref) {
  const m = ref.match(/^(\S+):(\d+)(?:-(\d+))?$/)
  if (!m) return { ref, text: '' }
  const [, file, start, end] = m
  const lines = file === 'zhouyi.txt' ? ZHOUYI_LINES : MEIHUA_LINES
  const s = parseInt(start, 10)
  const e = end ? parseInt(end, 10) : s
  return { ref, file, text: lines.slice(s - 1, e).join('\n').trim() }
}

// 冲突检测（并列展示，不合并成伪精确分数）
export function detectConflicts(findings) {
  const pol = new Set(findings.filter((f) => f.polarity !== 'neutral').map((f) => f.polarity))
  return pol.size > 1 ? ['同時存在有利與不利之象，需結合互卦、變卦與旺衰複核'] : []
}

// 断语插件注册表：新增方法只需在此登记，不改调度逻辑
const QUOTE_PLUGINS = { meihua: MeihuaQuote, zhouyi: ZhouyiQuote }

// 统一入口：按 methodId 调度插件
export function quotes(methodId, result, intent) {
  const plugin = QUOTE_PLUGINS[methodId]
  return plugin ? plugin.quotes(result, intent) : []
}
