import { useState } from 'react'
import { useApp } from '../core/AppContext.jsx'
import { CLASSICS, makeTree, flattenTree, sectionText } from '../domain/classics.js'

export default function SourcePanel() {
  const { classic } = useApp()
  const [selected, setSelected] = useState(null)
  const text = CLASSICS[classic].text
  const tree = makeTree(text)
  const all = flattenTree(tree)
  const renderTree = (nodes) => nodes.map((n) => (
    <details key={n.id} open={n.level === 1}>
      <summary onClick={() => setSelected(n)}>{n.title}</summary>
      {n.children.length ? renderTree(n.children) : null}
    </details>
  ))
  return (
    <div className="source-panel">
      <aside className="source-tree">
        <div className="src-book">{CLASSICS[classic].title}</div>
        {renderTree(tree)}
      </aside>
      <article className="source-reading">
        {selected ? (
          <>
            <h3>{selected.title}</h3>
            <pre>{sectionText(text, selected, all)}</pre>
          </>
        ) : (
          <p className="source-empty">從左側目錄選擇章節閱讀</p>
        )}
      </article>
    </div>
  )
}
