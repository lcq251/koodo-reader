// 典籍数据 + 原文目录树解析 + 占例提取 + 知识图谱数据
import meihuaText from '../data/texts/meihua.txt?raw'
import zhouyiText from '../data/texts/zhouyi.txt?raw'

export const CLASSICS = {
  meihua: { id: 'meihua', name: '梅花易數', title: '《梅花易數》', text: meihuaText },
  zhouyi: { id: 'zhouyi', name: '周易', title: '《周易》', text: zhouyiText },
}

// 解析 =/==/=== 标题为目录树
export function makeTree(text) {
  const lines = text.split('\n')
  const roots = []
  const stack = []
  lines.forEach((line, idx) => {
    const m = line.match(/^(={1,4})\s*(.+?)\s*=*$/)
    if (!m || !m[2].trim()) return
    const level = m[1].length
    const node = { id: idx, level, title: m[2].trim(), line: idx, children: [] }
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop()
    if (stack.length) stack[stack.length - 1].children.push(node)
    else roots.push(node)
    stack.push(node)
  })
  return roots
}

// 展平目录节点（按行号排序）
export function flattenTree(nodes) {
  return nodes.flatMap((n) => [n, ...flattenTree(n.children)])
}

// 取某节点对应的原文段落
export function sectionText(text, node, all) {
  const next = all.find((h) => h.line > node.line && h.level <= node.level)
  return text.split('\n').slice(node.line, next ? next.line : undefined).join('\n').trim()
}

// 占例：从目录树提取以「占」结尾的章节（观梅占、牡丹占等）
export function extractCases(text) {
  const tree = makeTree(text)
  const all = flattenTree(tree)
  const cases = []
  for (const node of all) {
    if (/占$/.test(node.title) && node.level >= 2) {
      cases.push({ id: node.id, title: node.title, text: sectionText(text, node, all) })
    }
  }
  return cases
}

// 知识图谱：八卦 + 五行 + 生克关系
export const GRAPH = {
  nodes: [
    { id: 'qian', label: '乾', kind: '卦象', elem: '金' },
    { id: 'dui', label: '兌', kind: '卦象', elem: '金' },
    { id: 'li', label: '離', kind: '卦象', elem: '火' },
    { id: 'zhen', label: '震', kind: '卦象', elem: '木' },
    { id: 'xun', label: '巽', kind: '卦象', elem: '木' },
    { id: 'kan', label: '坎', kind: '卦象', elem: '水' },
    { id: 'gen', label: '艮', kind: '卦象', elem: '土' },
    { id: 'kun', label: '坤', kind: '卦象', elem: '土' },
    { id: 'jin', label: '金', kind: '五行' },
    { id: 'mu', label: '木', kind: '五行' },
    { id: 'shui', label: '水', kind: '五行' },
    { id: 'huo', label: '火', kind: '五行' },
    { id: 'tu', label: '土', kind: '五行' },
  ],
  edges: [
    // 卦象 → 五行
    { from: 'qian', to: 'jin', label: '屬' }, { from: 'dui', to: 'jin', label: '屬' },
    { from: 'li', to: 'huo', label: '屬' }, { from: 'zhen', to: 'mu', label: '屬' },
    { from: 'xun', to: 'mu', label: '屬' }, { from: 'kan', to: 'shui', label: '屬' },
    { from: 'gen', to: 'tu', label: '屬' }, { from: 'kun', to: 'tu', label: '屬' },
    // 五行相生
    { from: 'jin', to: 'shui', label: '生' }, { from: 'shui', to: 'mu', label: '生' },
    { from: 'mu', to: 'huo', label: '生' }, { from: 'huo', to: 'tu', label: '生' },
    { from: 'tu', to: 'jin', label: '生' },
    // 五行相克
    { from: 'jin', to: 'mu', label: '克' }, { from: 'mu', to: 'tu', label: '克' },
    { from: 'tu', to: 'shui', label: '克' }, { from: 'shui', to: 'huo', label: '克' },
    { from: 'huo', to: 'jin', label: '克' },
  ],
}

// —— 梅花易数章节分类（易理 / 解釋 / 方法 / 斷言 / 象意 / 案例）——
export const MEIHUA_CATEGORIES = {
  易理: { desc: '卦數 · 五行 · 體用 · 衰旺' },
  解釋: { desc: '三要靈應 · 十應詳解' },
  方法: { desc: '起卦 · 占斷操作' },
  斷言: { desc: '斷語 · 吉凶 · 歌訣' },
  象意: { desc: '取象 · 萬物屬類' },
  案例: { desc: '觀梅占 · 牡丹占' },
}

const CHAPTER_CATEGORY = {
  周易卦數: '易理', 五行生克: '易理', 八宮所屬五行: '易理', 卦氣旺: '易理', 卦氣衰: '易理',
  十天干: '易理', 十二地支: '易理', 八卦象例: '易理', 八卦方位圖: '易理', 先天後天論: '易理',
  十應奧論: '易理', 體用: '易理', 體用論: '易理', 衰旺論: '易理', 內外論: '易理',
  動靜: '易理', 向背: '易理', 靜占: '易理', 八卦定陰陽次序: '易理', 諸卦反對性情: '易理',
  三要靈應篇序: '解釋', 三要靈應篇: '解釋', 十應目論: '解釋', 複明天時之應: '解釋',
  複明地理之應: '解釋', 複明人事之應: '解釋', 複明時令之應: '解釋', 複明方卦之應: '解釋',
  複明動物之應: '解釋', 複明靜物之應: '解釋', 複明言語之應: '解釋', 複明聲音之應: '解釋',
  複明五色之應: '解釋', 複明寫字之應: '解釋', 遺論: '解釋', 觀梅數訣序: '解釋',
  占法: '方法', 玩法: '方法', 卦以八除: '方法', 爻以六除: '方法', 互卦起例: '方法',
  年月日時起例: '方法', 物數占例: '方法', 聲音占例: '方法', 字占: '方法', 一字占至十一字占: '方法',
  丈尺占: '方法', 尺寸占: '方法', 為人占: '方法', 自己占: '方法', 占動物: '方法',
  占靜物: '方法', '物卦起例（端法後天起卦）': '方法', 起卦加數例: '方法', 變卦式八則: '方法',
  觀物看變爻為主: '方法', 觀物克應法: '方法', 觀物趣時訣: '方法', 觀物用易例: '方法',
  心易占卜玄機: '斷言', 占卜總決: '斷言', 占卜論理訣: '斷言', 卦斷遺論: '斷言',
  八卦心易體用訣: '斷言', 體用總訣: '斷言', 天時占第一: '斷言', 人事占第二: '斷言',
  家宅占第三: '斷言', 屋舍占第四: '斷言', 婚姻占第五: '斷言', 生產占第六: '斷言',
  飲食占第七: '斷言', 求謀占第八: '斷言', 求名占第九: '斷言', 求財占第十: '斷言',
  交易占第十一: '斷言', 出行占第十二: '斷言', 行人占第十三: '斷言', 謁見占第十四: '斷言',
  失物占第十五: '斷言', 疾病占第十六: '斷言', 官訟占第十七: '斷言', 墳墓占第十八: '斷言',
  觀物洞玄歌: '斷言', 屋宅之占訣: '斷言', 器物占: '斷言', 占卦訣: '斷言',
  體用互變之訣: '斷言', 體用生克之訣: '斷言', 體用衰旺之訣: '斷言', 體用動靜之訣: '斷言',
  占卜坐端之訣: '斷言', 占卜克應之訣: '斷言', 觀物玄妙歌訣: '斷言', 諸事響應歌: '斷言',
  物數為體訣: '斷言', 占卜十應訣: '斷言', '論事十大應（論日辰秘文）': '斷言',
  '八卦萬物屬類（並為上卦）': '象意', 八卦類象: '象意', 八卦萬物屬類: '象意', 萬物賦: '象意',
  飲食篇: '象意', 占物類例: '象意', '卦應（與前八卦類象，大同小異，觀者可以互參）': '象意',
  觀梅占: '案例', 牡丹占: '案例', 鄰夜扣門借物占: '案例', 今日動靜如何: '案例',
  西林寺牌額占: '案例', 老人有憂色占: '案例', 少年有喜色占: '案例', 牛哀鳴占: '案例',
  雞悲鳴占: '案例', 枯枝墜地占: '案例', 風覺鳥占: '案例', 風覺占: '案例',
  鳥占: '案例', 聽聲音占: '案例', 形物占: '案例', 驗色占: '案例', 萬物戲驗: '案例',
}

// 返回按维度分组的章节（含行号与原文）
export function categorizedSections() {
  const text = CLASSICS.meihua.text
  const all = flattenTree(makeTree(text))
  const groups = {}
  for (const node of all) {
    const cat = CHAPTER_CATEGORY[node.title]
    if (!cat) continue
    if (!groups[cat]) groups[cat] = []
    groups[cat].push({ title: node.title, line: node.line, text: sectionText(text, node, all) })
  }
  return groups
}
