// 周易多来源解读（公版 sunls2/zhouyi）：卦辞原文 + 白话 + 邵雍 + 傅佩荣 + 传统解卦 + 6爻
import zhouyiNotes from '../data/zhouyi-notes.classic-v1.json'

// fullName（简体，如「泽火革」）→ 多来源解读
export function notesOf(fullName) {
  const h = zhouyiNotes.hexagrams.find((x) => x.name === fullName)
  return h ? {
    guaCi: h.guaCi,
    xiang: h.xiang,
    baihua: h.baihua,
    shaoyong: h.shaoyong,
    fupeirong: h.fupeirong,
    traditional: h.traditional,
    yao: h.yao,
  } : null
}
