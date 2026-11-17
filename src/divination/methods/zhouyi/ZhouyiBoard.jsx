import { tradify } from '../../core/tradify.js'

function YaoPanel({ gua, dongSet, label, className, simple }) {
  const rows = simple ? [] : [...(gua.yaoList || [])].reverse() // 上爻在上
  return (
    <div className={'gua-panel ' + (className || '')}>
      <div className="gname">{tradify(gua.fullName)}</div>
      <div className="gsub">{label}{gua.gongElem ? ' · ' + tradify(gua.gongElem) : ''}{gua.shi ? ' · 世' + gua.shi + '應' + gua.ying : ''}</div>
      {simple ? null : rows.map((y) => {
        const isDong = dongSet && dongSet.has(y.position)
        return (
          <div key={y.position} className={'yao-row' + (isDong ? ' dong' : '')}>
            <span className="y-najia">{y.naJia}</span>
            <span className="y-liuqin">{tradify(y.liuQin)}</span>
            <span className="y-shou">{tradify(y.liuShou)}</span>
            <span className="y-sy">{y.shiYing ? tradify(y.shiYing) : '　'}</span>
            <span className="y-line">
              <span className={'seg' + (y.yinYang ? '' : ' yin') + (isDong ? ' dong' : '')} />
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function ZhouyiBoard({ result }) {
  if (!result) return null
  const r = result
  const dongSet = new Set(r.dongYao)
  return (
    <div className="board-col">
      <div className="gua-stack">
        <YaoPanel gua={r.benGua} dongSet={dongSet} label="本卦" />
        <YaoPanel gua={r.zhiGua} dongSet={dongSet} label="之卦" className="changed" />
        <YaoPanel gua={r.huGua} label="互卦" className="mutual" simple />
      </div>
      <div className="board-caption">
        日辰：{r.dayGanZhi} ｜ 動爻：{r.dongYao.length ? r.dongYao.map((p) => tradify('第' + p + '爻')).join('、') : '無（六爻皆靜）'} ｜ 旬空：{tradify(r.xunKong.join(''))}
      </div>
      <div className="legend">
        <span><i className="dot xiong" />{tradify('動爻')}</span>
        <span><i className="dot zf" />{tradify('世應')}</span>
        <span>{tradify('納甲 六親 六神')}</span>
      </div>
    </div>
  )
}
