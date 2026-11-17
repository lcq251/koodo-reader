export default function MeihuaInput({ value, onChange }) {
  const v = value || {}
  const set = (k, val) => onChange({ ...v, [k]: val })
  return (
    <>
      <label className="f">起卦方式</label>
      <select value={v.mode || 'time'} onChange={(e) => set('mode', e.target.value)}>
        <option value="time">時間起卦</option>
        <option value="count">報數起卦</option>
      </select>
      {v.mode === 'count' ? (
        <div className="row3" style={{ marginTop: 12 }}>
          <div><label className="f">上卦數</label><input type="number" value={v.n1 ?? ''} onChange={(e) => set('n1', e.target.value)} /></div>
          <div><label className="f">下卦數</label><input type="number" value={v.n2 ?? ''} onChange={(e) => set('n2', e.target.value)} /></div>
          <div><label className="f">動爻數</label><input type="number" value={v.n3 ?? ''} onChange={(e) => set('n3', e.target.value)} /></div>
        </div>
      ) : (
        <>
          <label className="f">公曆時間</label>
          <input type="datetime-local" value={v.date || '2024-06-15T10:00'} onChange={(e) => set('date', e.target.value)} />
        </>
      )}
    </>
  )
}
