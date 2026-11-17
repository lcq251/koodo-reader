import { Fragment } from 'react'
import { useApp } from '../core/AppContext.jsx'
import Card from '../ui/Card.jsx'
import { tradify } from '../core/tradify.js'

export default function InfoPanel() {
  const { result, method } = useApp()
  if (!result) return <Card title="盤局"><div className="note">尚未排盤</div></Card>
  const s = method.summary(result)
  return (
    <Card title="盤局" tag={method.name}>
      <div className="pillars">
        {s.pillars.map((p) => (
          <div key={p.k} className="pillar"><div className="k">{p.k}</div><div className="v">{tradify(p.v)}</div></div>
        ))}
      </div>
      <div className="ju-line"><span className="ju-big">{tradify(s.headline)}</span><span className="ju-sub">{tradify(s.sub)}</span></div>
      <div className="kv">
        {s.kv.map((p, i) => (
          <Fragment key={i}><span className="k">{tradify(p.k)}</span><span className="v">{tradify(p.v)}</span></Fragment>
        ))}
      </div>
    </Card>
  )
}
