import { useState } from 'react'
import wanwuData from '../data/wanwu-shulei.classic-v1.json'

// 万物属类：直引 meihuayishu 抽出的 wanwu-shulei.classic-v1.json
export default function WanwuPanel() {
  const [name, setName] = useState(wanwuData.trigrams[0].name)
  const t = wanwuData.trigrams.find((x) => x.name === name)

  return (
    <div className="wanwu-panel">
      <div className="wanwu-tabs" role="tablist" aria-label="選擇八卦">
        {wanwuData.trigrams.map((x) => (
          <button
            key={x.name}
            role="tab"
            aria-selected={x.name === name}
            className={x.name === name ? 'active' : ''}
            onClick={() => setName(x.name)}
          >
            {x.name}<small>{x.element}</small>
          </button>
        ))}
      </div>
      <p className="wanwu-gong"><span>八宮</span>{t.gongGua.join(' · ')}</p>
      <dl className="wanwu-list">
        {t.fields.map((f) => (
          <div key={f.key} className="wanwu-item" title={`L${f.line} ${f.key}：${f.value}`}>
            <dt>{f.key}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
