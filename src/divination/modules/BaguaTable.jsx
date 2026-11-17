import trigramsData from '../data/trigrams.classic-v2.json'

// 八卦基础表：直引 meihuayishu 抽出的 trigrams.classic-v2.json
const COLUMNS = [
  ['name', '卦名'], ['xiantian', '先天數'], ['houtian', '後天數'],
  ['element', '五行'], ['direction', '方位'], ['wang', '旺'], ['shuai', '衰'],
  ['heshu', '河圖數'], ['renlun', '人倫'], ['xiang', '卦象'],
  ['wuwei', '五味'], ['wuse', '五色'], ['xingzi', '姓字'],
]

export default function BaguaTable() {
  const { trigrams, center } = trigramsData
  return (
    <div className="bagua-table">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>{COLUMNS.map(([, label]) => <th key={label}>{label}</th>)}</tr>
          </thead>
          <tbody>
            {trigrams.map((t) => (
              <tr key={t.name}>
                {COLUMNS.map(([key]) => {
                  const v = t[key]
                  const ref = t.refs[key]
                  const text = Array.isArray(v) ? v.join('、') : v == null || v === '' ? '—' : v
                  return (
                    <td key={key} title={ref ? `L${ref.line} ${ref.quote}` : undefined}>{text}</td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="bagua-note">中五（洛書數 {center.houtian}）不入八卦。數據直引《梅花易數》，懸停單元格見原文行號與出處。</p>
    </div>
  )
}
