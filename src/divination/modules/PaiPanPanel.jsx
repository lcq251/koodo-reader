import { useApp } from '../core/AppContext.jsx'
import Card from '../ui/Card.jsx'

// 排盘输入（数据源/意图已迁到「配置」模块）
export default function PaiPanPanel() {
  const { options, setOptions, run, reset, method } = useApp()
  const InputComp = method.input
  return (
    <Card title="排盤">
      <InputComp value={options} onChange={setOptions} />
      <div className="btn-row">
        <button className="pai" onClick={() => run(options)}>排 盤</button>
        <button className="reset" onClick={reset}>重 置</button>
      </div>
    </Card>
  )
}
