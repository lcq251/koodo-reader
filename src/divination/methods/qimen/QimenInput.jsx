export default function QimenInput({ value, onChange }) {
  const v = value || {}
  const set = (k, val) => onChange({ ...v, [k]: val })
  return (
    <>
      <label className="f">公曆時間（UTC+8）</label>
      <input type="datetime-local" value={v.date || '2024-06-15T10:00'} onChange={(e) => set('date', e.target.value)} step="3600" />
      <div className="row" style={{ marginTop: 12 }}>
        <div>
          <label className="f">陰陽遁</label>
          <select value={v.yy || 'auto'} onChange={(e) => set('yy', e.target.value)}>
            <option value="auto">自動</option>
            <option value="yang">陽遁</option>
            <option value="yin">陰遁</option>
          </select>
        </div>
        <div>
          <label className="f">局數</label>
          <select value={v.ju || 'auto'} onChange={(e) => set('ju', e.target.value)}>
            <option value="auto">自動</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
    </>
  )
}
