import { useState, useMemo } from 'react'
import { MEIHUA_CATEGORIES, categorizedSections, GRAPH } from '../domain/classics.js'
import BaguaTable from './BaguaTable.jsx'
import WanwuPanel from './WanwuPanel.jsx'

// 八卦-五行关系图（SVG）
function RelationGraph() {
  const CX = 180, CY = 180, R_OUT = 132, R_IN = 60
  const pos = {}
  GRAPH.nodes.filter((n) => n.kind === '卦象').forEach((n, i) => {
    const a = (i / 8) * 2 * Math.PI - Math.PI / 2
    pos[n.id] = [CX + R_OUT * Math.cos(a), CY + R_OUT * Math.sin(a)]
  })
  GRAPH.nodes.filter((n) => n.kind === '五行').forEach((n, i) => {
    const a = (i / 5) * 2 * Math.PI - Math.PI / 2
    pos[n.id] = [CX + R_IN * Math.cos(a), CY + R_IN * Math.sin(a)]
  })
  const color = (kind) => (kind === '卦象' ? '#8f3f2d' : '#39735b')
  const edgeColor = (label) => (label === '生' ? '#4a7a52' : label === '克' ? '#b13a2c' : '#c8b9aa')
  return (
    <div className="graph-panel">
      <svg viewBox="0 0 360 360" role="img" aria-label="八卦五行關係圖">
        {GRAPH.edges.map((e, i) => {
          const [x1, y1] = pos[e.from]
          const [x2, y2] = pos[e.to]
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={edgeColor(e.label)} strokeWidth="1.2" />
              <text x={mx} y={my - 4} className="edge-label" fill={edgeColor(e.label)}>{e.label}</text>
            </g>
          )
        })}
        {GRAPH.nodes.map((n) => {
          const [x, y] = pos[n.id]
          return (
            <g key={n.id}>
              <circle cx={x} cy={y} r="18" fill={color(n.kind)} />
              <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="13">{n.label}</text>
            </g>
          )
        })}
      </svg>
      <div className="graph-legend">外圈卦象 · 內圈五行；連線：屬（灰）· 生（綠）· 克（朱）</div>
    </div>
  )
}

const SPECIAL = { __graph: '八卦五行', __bagua: '八卦基礎表', __wanwu: '萬物屬類' }
function Crumb({ path, onNav }) {
  const first = path[0]
  return (
    <div className="crumb">
      <button onClick={() => onNav([])}>維度</button>
      {first && (
        <span> / <button onClick={() => onNav([first])}>{SPECIAL[first] || first}</button></span>
      )}
      {path.length > 1 && <span> / <b>章節</b></span>}
    </div>
  )
}

export default function GraphPanel() {
  const [path, setPath] = useState([])
  const groups = useMemo(() => categorizedSections(), [])

  // 关系图
  if (path[0] === '__graph') {
    return <div className="dim-reading"><Crumb path={path} onNav={setPath} /><RelationGraph /></div>
  }

  // 八卦基础表
  if (path[0] === '__bagua') {
    return <div className="dim-reading"><Crumb path={path} onNav={setPath} /><BaguaTable /></div>
  }

  // 万物属类
  if (path[0] === '__wanwu') {
    return <div className="dim-reading"><Crumb path={path} onNav={setPath} /><WanwuPanel /></div>
  }

  // 第一层：维度卡片
  if (path.length === 0) {
    return (
      <div className="dim-grid">
        {Object.entries(MEIHUA_CATEGORIES).map(([cat, { desc }]) => (
          <button key={cat} className="dim-card" onClick={() => setPath([cat])}>
            <span className="dim-name">{cat}</span>
            <span className="dim-count">{groups[cat]?.length || 0} 章</span>
            <span className="dim-desc">{desc}</span>
          </button>
        ))}
        <button className="dim-card dim-card-graph" onClick={() => setPath(['__graph'])}>
          <span className="dim-name">八卦五行</span>
          <span className="dim-count">關係圖</span>
          <span className="dim-desc">卦象 · 生克</span>
        </button>
        <button className="dim-card" onClick={() => setPath(['__bagua'])}>
          <span className="dim-name">八卦基礎表</span>
          <span className="dim-count">8 卦</span>
          <span className="dim-desc">先天 · 後天 · 五行</span>
        </button>
        <button className="dim-card" onClick={() => setPath(['__wanwu'])}>
          <span className="dim-name">萬物屬類</span>
          <span className="dim-count">26 維度</span>
          <span className="dim-desc">八宮 · 天時 · 人物</span>
        </button>
      </div>
    )
  }

  // 第二层：章节列表
  const cat = path[0]
  if (path.length === 1) {
    const list = groups[cat] || []
    return (
      <div className="dim-chapters">
        <Crumb path={path} onNav={setPath} />
        <div className="chapter-grid">
          {list.map((s) => (
            <button key={s.line} className="chapter-item" onClick={() => setPath([cat, s.line])}>{s.title}</button>
          ))}
        </div>
      </div>
    )
  }

  // 第三层：原文内容
  const [, line] = path
  const section = groups[cat]?.find((s) => s.line === line)
  return (
    <div className="dim-reading">
      <Crumb path={path} onNav={setPath} />
      <h3 className="dim-title">{section?.title}</h3>
      <pre className="dim-text">{section?.text}</pre>
    </div>
  )
}
