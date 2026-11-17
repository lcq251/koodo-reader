import { useState } from 'react'
import { useApp } from '../../core/AppContext.jsx'
import { tradify } from '../../core/tradify.js'
import { LUOSHU_BAGUA, LUOSHU_NUM, PALACE_ELEM, DOOR_JX } from './engine.js'

const LAYERS = [['star', '九星'], ['door', '八門'], ['god', '八神'], ['tian', '天盤'], ['di', '地盤']]

export default function QimenBoard({ result }) {
  const { setSelected } = useApp()
  const [layers, setLayers] = useState({ star: true, door: true, god: true, tian: true, di: true })
  if (!result) return null
  const r = result
  const toggle = (k) => setLayers((s) => ({ ...s, [k]: !s[k] }))
  return (
    <div className="board-col">
      <div className="toggles">
        {LAYERS.map(([k, label]) => (
          <span key={k} className={'tg ' + (layers[k] ? 'on' : '')} onClick={() => toggle(k)}>{label}</span>
        ))}
      </div>
      <div className="qimen-board">
        {Array.from({ length: 9 }, (_, i) => {
          const jx = DOOR_JX[r.八门[i]]
          const isZhiFu = r.九星[i] === r.值符
          const isZhiShi = r.八门[i] === r.值使 && r.八门[i]
          return (
            <div
              key={i}
              className={'cell' + (i === 4 ? ' zhong' : '') + (isZhiFu ? ' zhifu' : '') + (isZhiShi ? ' zhishi' : '')}
              onMouseEnter={() => setSelected({ type: 'qimen', gua: LUOSHU_BAGUA[i], num: LUOSHU_NUM[i], elem: PALACE_ELEM[i], star: r.九星[i], door: r.八门[i], god: r.八神[i], tian: r.天盘[i], di: r.地盘[i] })}
            >
              <div className="corner">{tradify(LUOSHU_BAGUA[i])}{LUOSHU_NUM[i]}</div>
              {layers.star && <div className="qstar">{tradify(r.九星[i])}</div>}
              {layers.door && <div className={'qdoor ' + (jx === '吉' ? 'ji' : jx === '凶' ? 'xiong' : '')}>{tradify(r.八门[i])}</div>}
              {layers.god && <div className="qgod">{tradify(r.八神[i])}</div>}
              {(layers.tian || layers.di) && (
                <div className="qgan">
                  {layers.tian && <span className="t">{r.天盘[i]}</span>}
                  {layers.di && <span className="d">{r.地盘[i]}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="board-caption">九宮洛書 · 上南下北 · 中宮寄坤</div>
      <div className="legend">
        <span><i className="dot ji" />{tradify('吉門（開休生）')}</span>
        <span><i className="dot xiong" />{tradify('凶門')}</span>
        <span><i className="dot zf" />{tradify('值符 / 值使落宮')}</span>
      </div>
    </div>
  )
}
