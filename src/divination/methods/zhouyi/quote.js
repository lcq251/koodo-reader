// 周易断语插件：直引本卦卦辞 / 动爻爻辞 / 之卦卦辞
import zhouyiIndex from '../../data/index/zhouyi.index.json'
import { tradify } from '../../core/tradify.js'

export default {
  methodId: 'zhouyi',
  quotes(result) {
    const byName = (n) => {
      const tw = tradify(n)
      return zhouyiIndex.hexagrams.find((h) => h.name === tw) || zhouyiIndex.hexagrams.find((h) => h.name === n)
    }
    const ben = byName(result.benGua.fullName)
    const zhi = byName(result.zhiGua.fullName)
    const findings = []
    if (ben) {
      findings.push({
        id: 'ben-gua-ci', label: `本卦「${ben.name}」卦辭：${ben.guaCi}`, polarity: 'neutral',
        sourceLevel: '明確規則', quoteType: '直引', sourceRefs: [`zhouyi.txt:${ben.line}`], evidence: [`本卦 ${ben.name}`],
      })
      for (const pos of result.dongYao) {
        const yc = ben.yaoCi[pos - 1]
        if (yc) {
          findings.push({
            id: `dong-yao-${pos}`, label: `動爻 · 第${pos}爻爻辭：${yc}`, polarity: 'neutral',
            sourceLevel: '明確規則', quoteType: '直引', sourceRefs: [`zhouyi.txt:${ben.line + 1 + (pos - 1)}`], evidence: [`第 ${pos} 爻發動`],
          })
        }
      }
    }
    if (zhi) {
      findings.push({
        id: 'zhi-gua-ci', label: `之卦「${zhi.name}」卦辭：${zhi.guaCi}`, polarity: 'neutral',
        sourceLevel: '明確規則', quoteType: '直引', sourceRefs: [`zhouyi.txt:${zhi.line}`], evidence: [`之卦 ${zhi.name}`],
      })
    }
    return findings
  },
}
