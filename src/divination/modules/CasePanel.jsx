import { useApp } from '../core/AppContext.jsx'
import { CLASSICS, extractCases } from '../domain/classics.js'
import { qiGuaByTimeNums, qiGuaByCounts } from '../methods/meihua/engine.js'
import { quotes } from '../domain/quote-engine.js'
import { assert, ASSERTION_CONFIG } from '../domain/assertion.js'
import { tradify } from '../core/tradify.js'
import caseBaseline from '../data/case-baseline.classic-v1.json'

const REL_TXT = { same: '體用比和', useGeneratesBody: '用生體', bodyGeneratesUse: '體生用', useControlsBody: '用克體', bodyControlsUse: '體克用' }

// 用断言模型对基线案例重新排盘推导
function deriveBaseline(c) {
  let result
  if (c.method === '年月日時占') {
    result = qiGuaByTimeNums(c.inputs.yearNumber, c.inputs.month, c.inputs.day, c.inputs.hourNumber)
  } else {
    const total = c.inputs.upperNumber + c.inputs.lowerNumber + c.inputs.hourNumber
    result = qiGuaByCounts(c.inputs.upperNumber, c.inputs.lowerNumber, total)
  }
  const findings = quotes('meihua', result, 'general')
  const conclusion = assert(findings, ASSERTION_CONFIG)
  return { result, conclusion }
}

export default function CasePanel() {
  const { classic } = useApp()
  if (classic === 'zhouyi') {
    return (
      <div className="case-panel">
        <p className="source-empty">《周易》本無占例，可於「原文」查卦辭爻辭，或於「易理」看當前卦解。</p>
      </div>
    )
  }
  const cases = extractCases(CLASSICS.meihua.text)
  return (
    <div className="case-panel">
      {cases.map((c) => {
        const baseline = caseBaseline.cases.find((b) => c.title.includes(b.name))
        const derive = baseline ? deriveBaseline(baseline) : null
        return (
          <details key={c.id} className="case-item">
            <summary>
              {c.title}
              {derive && <span className={'case-badge ' + derive.conclusion.verdict}>{derive.conclusion.verdict}</span>}
            </summary>
            <pre>{c.text}</pre>
            {derive && (
              <div className="case-derive">
                <div className="case-derive-title">斷言模型推導</div>
                <div className="case-derive-line">
                  本卦「{tradify(derive.result.main.fullName)}」· 體{derive.result.body}（{derive.result.bodyElem}）用{derive.result.use}（{derive.result.useElem}）· {REL_TXT[derive.result.relation]}
                </div>
                <div className="case-derive-line">
                  判詞「{derive.conclusion.verdict}」—— {derive.conclusion.summary}
                </div>
                <div className="case-diff">
                  異同：案例斷語為「具體事象」（類象 + 外應 + 明理），斷言模型為「吉凶方向」（體用生克）。前者是後者的具體化，二者層次不同、互為補充。
                </div>
              </div>
            )}
          </details>
        )
      })}
    </div>
  )
}
