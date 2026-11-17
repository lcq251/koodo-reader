import { useApp } from '../core/AppContext.jsx'
import Card from '../ui/Card.jsx'
import { DATASOURCES } from '../config/methods.config.jsx'
import { INTENTS, SOURCE_LEVELS } from '../domain/quote-engine.js'
import { STAGES, VERDICT } from '../domain/assertion.js'

// 配置模块：首个配置项「断语配置」（数据源 / 意图 / 结论判定等级 / 只读展示）
export default function ConfigPanel() {
  const { methodId, dataSourceId, setDataSourceId, intent, setIntent, decisiveLevels, setDecisiveLevels } = useApp()
  const hasIntent = methodId === 'meihua' || methodId === 'zhouyi'

  const toggleLevel = (lv) => {
    setDecisiveLevels((prev) => (prev.includes(lv) ? prev.filter((x) => x !== lv) : [...prev, lv]))
  }

  return (
    <Card title="配置" tag="斷語">
      <label className="f">數據源</label>
      <select value={dataSourceId} onChange={(e) => setDataSourceId(e.target.value)}>
        {Object.values(DATASOURCES).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      {hasIntent && (
        <>
          <label className="f">解卦意圖</label>
          <select value={intent} onChange={(e) => setIntent(e.target.value)}>
            {INTENTS.map((it) => <option key={it.id} value={it.id}>{it.name}</option>)}
          </select>
        </>
      )}

      <label className="f">結論判定等級</label>
      <div className="level-checks">
        {SOURCE_LEVELS.map((lv) => (
          <label key={lv} className="level-check">
            <input type="checkbox" checked={decisiveLevels.includes(lv)} onChange={() => toggleLevel(lv)} />
            <span>{lv}</span>
          </label>
        ))}
      </div>

      <div className="cfg-readonly">
        <div className="cfg-subtitle">判詞映射</div>
        <div className="cfg-kv">
          {Object.entries(VERDICT).map(([k, v]) => <span key={k} className="cfg-chip">{k} → {v}</span>)}
        </div>
        <div className="cfg-subtitle">五層遞進</div>
        <div className="cfg-kv">
          {Object.entries(STAGES).map(([k, v]) => <span key={k} className="cfg-chip">{k} · {v}</span>)}
        </div>
      </div>
    </Card>
  )
}
