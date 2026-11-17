import { useApp } from '../core/AppContext.jsx'
import { METHODS } from '../config/methods.config.jsx'

// 左侧顶端：方法选择（无标题）
export default function MethodSelect() {
  const { methodId, switchMethod } = useApp()
  return (
    <div className="method-select">
      <select value={methodId} onChange={(e) => switchMethod(e.target.value)}>
        {Object.values(METHODS).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    </div>
  )
}
