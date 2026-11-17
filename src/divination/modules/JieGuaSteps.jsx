import { useApp } from '../core/AppContext.jsx'
import { tradify } from '../core/tradify.js'

const MODE_TXT = { time: '時間起卦', count: '報數起卦', manual: '手動爻值' }

// 方案B：只保留「排盤步驟」（起卦/成卦/裝卦），占斷結果全權由「斷語」模塊承載
const MEIHUA_STEPS = [
  { key: 'qigua', title: '起卦', desc: '卦以八除，爻以六除' },
  { key: 'chenggua', title: '成卦', desc: '本卦、互卦、變卦' },
]

const ZHOUYI_STEPS = [
  { key: 'qigua', title: '起卦', desc: '揲蓍 / 銅錢' },
  { key: 'zhuanggua', title: '裝卦', desc: '納甲納支、世應、六親、六神、旬空' },
  { key: 'benzhi', title: '定本卦 · 之卦', desc: '動爻變' },
]

function meihuaDetail(key, r, options) {
  const mode = options.mode || 'time'
  switch (key) {
    case 'qigua': return `起卦：${MODE_TXT[mode]}，上卦${tradify(r.main.upper)}、下卦${tradify(r.main.lower)}，動第${r.movingLine}爻`
    case 'chenggua': return `本卦「${tradify(r.main.fullName)}」· 互卦「${tradify(r.mutual.fullName)}」· 變卦「${tradify(r.changed.fullName)}」`
    default: return ''
  }
}

function zhouyiDetail(key, r, options) {
  const mode = options.mode || 'time'
  const dong = r.dongYao.length ? r.dongYao.map((p) => `第${p}爻`).join('、') : '六爻皆靜'
  switch (key) {
    case 'qigua': return `起卦：${MODE_TXT[mode]}${mode === 'manual' ? `，六爻 ${r.yaoString}` : ''}`
    case 'zhuanggua': return `${tradify(r.benGua.fullName)}為${tradify(r.benGua.gongElem)}宮，世在${r.benGua.shi}爻、應在${r.benGua.ying}爻，六神自日干起，旬空${r.xunKong.join('')}`
    case 'benzhi': return `本卦「${tradify(r.benGua.fullName)}」，之卦「${tradify(r.zhiGua.fullName)}」（${dong}）`
    default: return ''
  }
}

export default function JieGuaSteps() {
  const { methodId, result, options } = useApp()
  if (!result) return null
  const steps = methodId === 'meihua' ? MEIHUA_STEPS : methodId === 'zhouyi' ? ZHOUYI_STEPS : null
  if (!steps) return null
  const detail = methodId === 'meihua' ? meihuaDetail : zhouyiDetail
  return (
    <div className="card">
      <h2>排盤步驟<span className="tag">{methodId === 'meihua' ? '梅花易數' : '周易六爻'}</span></h2>
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.key} className="step">
            <span className="step-num">{i + 1}</span>
            <div className="step-body">
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
              <div className="step-detail">{detail(s.key, result, options)}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
