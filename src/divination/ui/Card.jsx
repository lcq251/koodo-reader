export default function Card({ title, tag, children }) {
  return (
    <div className="card">
      <h2>{title}{tag ? <span className="tag">{tag}</span> : null}</h2>
      {children}
    </div>
  )
}
