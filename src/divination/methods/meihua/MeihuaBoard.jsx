import { tradify } from '../../core/tradify.js'
import { TRIGRAM_NATURE, TRIGRAM_ELEM } from './engine.js'

// 六爻卦象（自下而上的 lines，1=阳 0=阴；上爻在上显示）
function YaoLines({ lines, moving }) {
  return (
    <div className="yao-symbol">
      {[...lines].reverse().map((x, i) => {
        const pos = lines.length - i // 6,5,4,3,2,1 自上而下
        const dong = moving === pos
        return <div key={i} className={'seg' + (x ? '' : ' yin') + (dong ? ' dong' : '')} />
      })}
    </div>
  )
}

function GuaCard({ label, sub, lines, moving, body, use, upper, lower, className }) {
  const isBody = (t) => t === body
  const isUse = (t) => t === use
  return (
    <div className={'gua-panel ' + (className || '')}>
      <div className="gname">{tradify(label)}</div>
      <div className="gsub">{sub}</div>
      <YaoLines lines={lines} moving={moving} />
      <div className="gsub" style={{ marginTop: 8 }}>
        {upper && lower ? (
          <>
            <span>{tradify(TRIGRAM_NATURE[upper])}</span>
            <span style={{ color: isBody(upper) ? 'var(--cinnabar)' : isUse(upper) ? 'var(--gold)' : 'var(--ink-3)' }}>
              {tradify(TRIGRAM_ELEM[upper])}{isBody(upper) ? '·體' : isUse(upper) ? '·用' : ''}
            </span>
            <span style={{ margin: '0 6px', color: 'var(--ink-3)' }}>/</span>
            <span>{tradify(TRIGRAM_NATURE[lower])}</span>
            <span style={{ color: isBody(lower) ? 'var(--cinnabar)' : isUse(lower) ? 'var(--gold)' : 'var(--ink-3)' }}>
              {tradify(TRIGRAM_ELEM[lower])}{isBody(lower) ? '·體' : isUse(lower) ? '·用' : ''}
            </span>
          </>
        ) : null}
      </div>
    </div>
  )
}

const REL = { same: '比和', useGeneratesBody: '用生體', bodyGeneratesUse: '體生用', useControlsBody: '用克體', bodyControlsUse: '體克用' }

export default function MeihuaBoard({ result }) {
  if (!result) return null
  const r = result
  return (
    <div className="board-col">
      <div className="gua-stack">
        <GuaCard label={r.main.fullName} sub="本卦" lines={r.lines.main} moving={r.movingLine} body={r.body} use={r.use} upper={r.main.upper} lower={r.main.lower} />
        <GuaCard label={r.mutual.fullName} sub="互卦" lines={r.lines.mutual} upper={r.mutual.upper} lower={r.mutual.lower} className="mutual" />
        <GuaCard label={r.changed.fullName} sub="變卦" lines={r.lines.changed} upper={r.changed.upper} lower={r.changed.lower} className="changed" />
      </div>
      <div className="board-caption">
        動爻：{r.movingLine} ｜ 體：{tradify(r.body)}（{tradify(r.bodyElem)}） 用：{tradify(r.use)}（{tradify(r.useElem)}） ｜ {tradify(REL[r.relation])}
      </div>
      <div className="legend">
        <span><i className="dot ji" />{tradify('體卦')}</span>
        <span><i className="dot zf" />{tradify('用卦')}</span>
        <span><i className="dot xiong" />{tradify('動爻')}</span>
      </div>
    </div>
  )
}
