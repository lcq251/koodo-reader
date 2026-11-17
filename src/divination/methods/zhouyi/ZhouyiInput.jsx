export default function ZhouyiInput({ value, onChange }) {
  const v = value || {}
  const mode = v.mode || 'time'
  const set = (k, val) => onChange({ ...v, [k]: val })
  return (
    <>
      <label className="f">起卦方式</label>
      <select value={mode} onChange={(e) => set('mode', e.target.value)}>
        <option value="time">時間起卦</option>
        <option value="count">報數起卦</option>
        <option value="manual">手動爻值</option>
      </select>
      {mode === 'time' ? (
        <>
          <label className="f">公曆時間</label>
          <input type="datetime-local" value={v.date || '2024-06-15T10:00'} onChange={(e) => set('date', e.target.value)} />
        </>
      ) : mode === 'count' ? (
        <div className="row3" style={{ marginTop: 12 }}>
          <div><label className="f">上卦數</label><input type="number" value={v.n1 ?? ''} onChange={(e) => set('n1', e.target.value)} /></div>
          <div><label className="f">下卦數</label><input type="number" value={v.n2 ?? ''} onChange={(e) => set('n2', e.target.value)} /></div>
          <div><label className="f">動爻數</label><input type="number" value={v.n3 ?? ''} onChange={(e) => set('n3', e.target.value)} /></div>
        </div>
      ) : (
        <>
          <label className="f">六爻值（自下而上，6/7/8/9）</label>
          <input type="text" value={v.yaoString || ''} onChange={(e) => set('yaoString', e.target.value)} placeholder="如 787978" />
        </>
      )}
    </>
  )
}
