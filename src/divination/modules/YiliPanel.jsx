import { useApp } from '../core/AppContext.jsx'
import { tradify } from '../core/tradify.js'
import zhouyiIndex from '../data/index/zhouyi.index.json'

const byName = (n) => {
  const tw = tradify(n)
  return zhouyiIndex.hexagrams.find((h) => h.name === tw) || zhouyiIndex.hexagrams.find((h) => h.name === n)
}

// 未排盘时的易理基础（八卦五行生克）
function YiliBase() {
  return (
    <div className="yili">
      <div className="yili-title">易理</div>
      <p className="yili-text">易有太極，是生兩儀，兩儀生四象，四象生八卦。</p>
      <p className="yili-text">八卦：乾兌離震巽坎艮坤。五行：金生水，水生木，木生火，火生土，土生金；金克木，木克土，土克水，水克火，火克金。</p>
      <p className="yili-text">排盤後，此處將顯示當前卦象的卦辭、彖辭與爻辭等易理原文。</p>
    </div>
  )
}

export default function YiliPanel() {
  const { methodId, result } = useApp()
  if (!result) return <YiliBase />

  if (methodId === 'zhouyi') {
    const ben = byName(result.benGua.fullName)
    return (
      <div className="yili">
        <div className="yili-title">易理 · {tradify(result.benGua.fullName)}</div>
        {ben && <p className="yili-text"><b>卦辭：</b>{ben.guaCi}</p>}
        {ben && ben.tuanCi && <p className="yili-text"><b>彖辭：</b>{ben.tuanCi}</p>}
        {ben && result.dongYao.length > 0 && (
          <p className="yili-text">
            <b>動爻：</b>
            {result.dongYao.map((p) => `${ben.yaoCi[p - 1]}`).join('；')}
          </p>
        )}
      </div>
    )
  }

  if (methodId === 'meihua') {
    return (
      <div className="yili">
        <div className="yili-title">易理 · {tradify(result.main.fullName)}</div>
        <p className="yili-text"><b>體用：</b>體為{tradify(result.body)}（{tradify(result.bodyElem)}），用為{tradify(result.use)}（{tradify(result.useElem)}）。</p>
        <p className="yili-text"><b>取象：</b>{tradify(result.main.upper)}上{tradify(result.main.lower)}下，動第{result.movingLine}爻。</p>
        <p className="yili-text"><b>五行：</b>{tradify(result.bodyElem)} 對 {tradify(result.useElem)}。</p>
      </div>
    )
  }

  // 奇门
  return (
    <div className="yili">
      <div className="yili-title">易理 · {tradify(result.阴阳)}遁{result.局数}局</div>
      <p className="yili-text"><b>四柱：</b>{result.年柱} {result.月柱} {result.日柱} {result.时柱}</p>
      <p className="yili-text"><b>定局：</b>{tradify(result.节气)} · {tradify(result.三元)}</p>
      <p className="yili-text"><b>值符值使：</b>{tradify(result.值符)} 落{result.值符落宫}，{tradify(result.值使)} 落{result.值使落宫}。</p>
    </div>
  )
}
