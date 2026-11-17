import { useState } from 'react'
import { useApp } from '../core/AppContext.jsx'
import Card from '../ui/Card.jsx'
import { tradify } from '../core/tradify.js'
import { quotes, detectConflicts, lookupSource } from '../domain/quote-engine.js'
import { assert, ASSERTION_CONFIG, STAGES, VERDICT, LEVEL_CLASS, VERDICT_CLASS, NOTE_TEXT, EMPTY_TEXT } from '../domain/assertion.js'
import { leixiangOf, QINGLI, WAIYING } from '../domain/leixiang.js'
import { guayiOf } from '../domain/guayi.js'
import { notesOf } from '../domain/zhouyi-notes.js'
import { wangshuaiOf } from '../domain/wangshuai.js'

export default function DuanYuPanel() {
  const { methodId, method, result, intent, dataSource, decisiveLevels, waixing, setWaixing, waixingJi, setWaixingJi } = useApp()
  const [openRef, setOpenRef] = useState(null)
  if (!result) return null
  const findings = quotes(methodId, result, intent)
  const conflicts = detectConflicts(findings)
  const shown = findings.filter((f) => dataSource.levels.includes(f.sourceLevel))
  const conclusion = assert(shown, { ...ASSERTION_CONFIG, decisiveLevels })
  const leixiang = methodId === 'meihua' ? leixiangOf(result) : null
  const guayi = methodId === 'meihua' ? guayiOf(result.main.fullName) : null
  const notes = methodId === 'meihua' ? notesOf(result.main.fullName) : null
  const wangshuai = methodId === 'meihua' ? wangshuaiOf(result.bodyElem, result.source?.monthNum) : null

  // 按五层递进分组（1 易辭 → 5 綜合）
  const groups = {}
  for (const f of shown) {
    const s = f.stage || 2
    if (!groups[s]) groups[s] = []
    groups[s].push(f)
  }
  const stageOrder = Object.keys(groups).map(Number).sort((a, b) => a - b)

  const renderFinding = (f, key) => (
    <article key={key} className={'finding ' + f.polarity}>
      <div className="f-head">
        <span className={'f-level ' + (LEVEL_CLASS[f.sourceLevel] || '')}>{f.sourceLevel}</span>
        <span className="f-quote">{f.quoteType}</span>
        <span className={'f-pol ' + f.polarity}>{VERDICT[f.polarity]}</span>
      </div>
      <div className="f-label">{f.label}</div>
      {f.baihua && <div className="f-baihua">譯：{f.baihua}</div>}
      <div className="f-evidence">{f.evidence.join(' · ')}</div>
      <div className="f-refs">
        {f.sourceRefs.map((ref) => (
          <button key={ref} className="f-ref" onClick={() => setOpenRef(openRef === ref ? null : ref)}>
            原文 {ref}
          </button>
        ))}
      </div>
      {openRef && f.sourceRefs.includes(openRef) && (
        <pre className="f-source">{lookupSource(openRef).text}</pre>
      )}
    </article>
  )

  return (
    <Card title="斷語" tag={dataSource.name}>
      {methodId === 'qimen' ? (
        <div className="duan">{tradify(method.duan(result))}</div>
      ) : (
        <>
          <div className={'conclusion ' + (VERDICT_CLASS[conclusion.verdict] || 'neutral')}>
            <span className="conclusion-verdict">{conclusion.verdict}</span>
            <span className="conclusion-summary">{conclusion.summary}</span>
          </div>
          {conclusion.conflict && (
            <div className="conclusion-conflict">{conclusion.conflict.join(' · ')}</div>
          )}

          {methodId === 'meihua' && (
            <div className="waixing-box">
              <div className="waixing-head">
                <span className="waixing-title">外應</span>
                <select className="waixing-ji" value={waixingJi} onChange={(e) => setWaixingJi(e.target.value)}>
                  {WAIYING.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <input className="waixing-input" value={waixing} onChange={(e) => setWaixing(e.target.value)} placeholder="如：見二雀爭枝墜地" />
              {waixing && (
                <div className="waixing-note">外應「{waixing}」判{waixingJi} —— {WAIYING.desc}</div>
              )}
            </div>
          )}

          {leixiang && (
            <div className="leixiang-box">
              <div className="leixiang-title">類象取物</div>
              {[leixiang.body, leixiang.use].map((side, i) => (
                <div key={i} className="leixiang-row">
                  <span className="leixiang-side">{i === 0 ? '體' : '用'} {side.name}</span>
                  {side.dims.map((d) => (
                    <span key={d.k} className="leixiang-dim"><b>{d.k}</b> {d.v}</span>
                  ))}
                </div>
              ))}
              <div className="leixiang-hint">據體用類象取物比類，如觀梅占「兌為少女、巽為股，故有傷股之應」</div>
            </div>
          )}

          {guayi && (
            <div className="guayi-box">
              <div className="guayi-title">卦義</div>
              <div className="guayi-line">本卦「{tradify(result.main.fullName)}」性情：{guayi.text}</div>
              <button className="f-ref" onClick={() => setOpenRef(openRef === guayi.refs[0] ? null : guayi.refs[0])}>原文 {guayi.refs[0]}</button>
              {openRef && guayi.refs.includes(openRef) && <pre className="f-source">{lookupSource(openRef).text}</pre>}
            </div>
          )}

          {wangshuai && (
            <div className="wangshuai-box">
              <span className="ws-title">體卦旺衰</span>
              <span className={'ws-tag ' + (wangshuai.state === '旺' || wangshuai.state === '相' ? 'sheng' : 'ke')}>
                {wangshuai.season}月 · {tradify(result.bodyElem)}{wangshuai.state}
              </span>
              <span className="ws-note">體卦宜乘旺，克體之卦宜衰</span>
            </div>
          )}

          {notes && (
            <div className="guaci-notes">
              <div className="gn-title">卦辭</div>
              <div className="gn-original">{notes.guaCi}</div>
              {notes.xiang && <div className="gn-xiang">{notes.xiang}</div>}
              {notes.baihua && <details className="gn-detail"><summary>白話</summary><p>{notes.baihua}</p></details>}
              {notes.shaoyong && <details className="gn-detail"><summary>邵雍解卦</summary><p>{notes.shaoyong}</p></details>}
              {notes.fupeirong && <details className="gn-detail"><summary>傅佩榮手冊</summary><p>{notes.fupeirong}</p></details>}
              {notes.traditional && <details className="gn-detail"><summary>傳統解卦</summary><p>{notes.traditional}</p></details>}
            </div>
          )}

          {shown.length ? (
            <div className="findings">
              {stageOrder.map((stage) => (
                <div key={stage} className="stage-group">
                  <div className="stage-title">{STAGES[stage]}</div>
                  {groups[stage].map((f, i) => renderFinding(f, `${stage}-${i}`))}
                </div>
              ))}
            </div>
          ) : (
            <div className="note">{EMPTY_TEXT}</div>
          )}

          {methodId === 'meihua' && (
            <div className="qingli-box">
              <div className="qingli-title">{QINGLI.title}</div>
              <div className="qingli-desc">{QINGLI.desc}</div>
              <div className="qingli-example">{QINGLI.example}</div>
            </div>
          )}
        </>
      )}
      {conflicts.map((c, i) => <div key={i} className="conflict">⚠ {c}</div>)}
      {methodId !== 'qimen' && <div className="note">{NOTE_TEXT}</div>}
    </Card>
  )
}
