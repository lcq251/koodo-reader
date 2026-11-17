import { useApp } from '../core/AppContext.jsx'
import Card from '../ui/Card.jsx'
import { tradify } from '../core/tradify.js'

const JI = new Set(['開門', '休門', '生門'])
const XIONG = new Set(['死門', '驚門', '傷門'])

export default function DetailPanel() {
  const { selected, methodId } = useApp()
  if (methodId !== 'qimen') return null
  if (!selected) return <Card title="詳情" tag="懸停盤面"><div className="note">懸停九宮格查看宮位詳情</div></Card>
  const s = selected
  const badge = s.door
    ? (JI.has(s.door) ? 'badge-ji' : XIONG.has(s.door) ? 'badge-xiong' : 'badge-ping')
    : 'badge-ping'
  return (
    <Card title="宮位詳情" tag="懸停盤面">
      <div className="d-head">
        <span className="d-gua">{tradify(s.gua)}宮</span>
        <span className="d-num">洛書數 {s.num}</span>
        <span className={'d-badge ' + badge}>{s.door ? '門·' + tradify(s.door) : '中宮無門'}</span>
      </div>
      <div className="d-grid">
        <span className="k">五行</span><span className="v">{tradify(s.elem)}</span>
        <span className="k">九星</span><span className="v">{tradify(s.star)}</span>
        <span className="k">八門</span><span className="v">{s.door ? tradify(s.door) : '—'}</span>
        <span className="k">八神</span><span className="v">{s.god ? tradify(s.god) : '—'}</span>
        <span className="k">天盤干</span><span className="v">{s.tian}</span>
        <span className="k">地盤干</span><span className="v">{s.di}</span>
      </div>
    </Card>
  )
}
