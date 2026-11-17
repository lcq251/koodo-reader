// 梅花断语插件：规则匹配（直引原文），按意图筛选；支持 always 普适原则 + 五层递进排序
import meihuaRules from '../../data/rules/meihua.rules.json'
import { tradify } from '../../core/tradify.js'

export default {
  methodId: 'meihua',
  quotes(result, intent) {
    const rules = meihuaRules.rules.filter((r) => r.intents.includes(intent || 'general'))
    return rules
      .filter((r) => r.when.field === 'always' || r.when.equals === result[r.when.field])
      .map((r) => ({
        id: r.id, label: r.label, polarity: r.polarity,
        sourceLevel: r.sourceLevel, quoteType: r.quoteType, sourceRefs: r.sourceRefs,
        baihua: r.baihua,
        stage: r.stage || 2,
        evidence: r.when.field === 'always'
          ? ['普適原則']
          : [`體卦 ${tradify(result.body)}（${tradify(result.bodyElem)}）`, `用卦 ${tradify(result.use)}（${tradify(result.useElem)}）`, `五行關係 ${tradify(result.relation)}`],
      }))
      .sort((a, b) => (a.stage || 2) - (b.stage || 2))
  },
}
