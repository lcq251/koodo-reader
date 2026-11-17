// L2 类象事象层 + L4 情理维度（数据层）
// 复用 wanwu-shulei（万物属类）提取体用卦类象；情理维度直引案例「明理」原文
import wanwuData from '../data/wanwu-shulei.classic-v1.json'
import { tradify } from '../core/tradify.js'

// 最能体现「具体事象」的维度
const DIMS = ['人物', '身體', '動物', '靜物']

function fieldOf(t, key) {
  return t?.fields.find((f) => f.key === key)?.value || '—'
}

// 体用卦 → 类象（供「取象比类」推断具体事象）
export function leixiangOf(result) {
  const bodyName = tradify(result.body)
  const useName = tradify(result.use)
  const body = wanwuData.trigrams.find((t) => t.name === bodyName)
  const use = wanwuData.trigrams.find((t) => t.name === useName)
  return {
    body: { name: bodyName, dims: DIMS.map((k) => ({ k, v: fieldOf(body, k) })) },
    use: { name: useName, dims: DIMS.map((k) => ({ k, v: fieldOf(use, k) })) },
  }
}

// L4 情理判断维度（直引「推數又須明理」+ 案例示范）
export const QINGLI = {
  title: '情理判斷',
  desc: '推數又須明理，為卜占之切要也。推數不推理，是不得也。學數者志之！',
  refs: ['meihua.txt:167'],
  example: '案例「扣門借物占」：斧亦可也，鋤亦可也；以理推之，夕晚安用鋤？必借斧。蓋斧切於劈柴之用耳。',
}

// L3 外应吉凶规则（直引原文）
export const WAIYING = {
  desc: '聞吉說見吉兆則吉，聞凶說見凶兆則凶',
  refs: ['meihua.txt:757'],
  options: ['吉', '凶', '中性'],
}
