// 方法注册表 + 数据源注册表（功能②③：方法选择、数据源选择、数据联动）
import { paiPan, paiPanManual, DOOR_JX } from '../methods/qimen/engine.js'
import { qiGuaByTimeNums, qiGuaByCounts } from '../methods/meihua/engine.js'
import { decodePan, timeQiGua, countQiGua } from '../methods/zhouyi/engine.js'
import { lunarInfo, hourZhiNum, yearZhiNum } from '../core/calendar.js'
import QimenInput from '../methods/qimen/QimenInput.jsx'
import QimenBoard from '../methods/qimen/QimenBoard.jsx'
import MeihuaInput from '../methods/meihua/MeihuaInput.jsx'
import MeihuaBoard from '../methods/meihua/MeihuaBoard.jsx'
import ZhouyiInput from '../methods/zhouyi/ZhouyiInput.jsx'
import ZhouyiBoard from '../methods/zhouyi/ZhouyiBoard.jsx'

const DEFAULT_DATE = '2024-06-15T10:00'

function parseDate(dt) {
  const [date, time] = (dt || DEFAULT_DATE).split('T')
  const [y, m, d] = date.split('-').map(Number)
  const h = parseInt((time || '00:00').split(':')[0], 10)
  return { y, m, d, h }
}

const REL_TXT = { same: '體用比和', useGeneratesBody: '用生體', bodyGeneratesUse: '體生用', useControlsBody: '用克體', bodyControlsUse: '體克用' }

export const METHODS = {
  qimen: {
    id: 'qimen', name: '奇門遁甲',
    input: QimenInput, board: QimenBoard,
    run(options) {
      const { y, m, d, h } = parseDate(options.date)
      let r = paiPan(y, m, d, h)
      if (options.yy && options.yy !== 'auto' && options.ju && options.ju !== 'auto') {
        r = paiPanManual(r, options.yy === 'yang', parseInt(options.ju, 10))
      }
      return r
    },
    summary(r) {
      return {
        pillars: [
          { k: '年柱', v: r.年柱 }, { k: '月柱', v: r.月柱 },
          { k: '日柱', v: r.日柱 }, { k: '時柱', v: r.时柱 },
        ],
        headline: `${r.阴阳}遁${r.局数}局`,
        sub: `${r.节气} · ${r.三元}`,
        kv: [
          { k: '旬首', v: `${r.旬首}（${r.符首}遁）` },
          { k: '值符', v: `${r.值符} 落${r.值符落宫}` },
          { k: '值使', v: `${r.值使} 落${r.值使落宫}` },
        ],
      }
    },
    duan(r) {
      const jx = DOOR_JX[r.值使]
      const t = { 吉: '屬吉門，利開拓進取', 平: '中平之門，宜守成按部就班', 凶: '屬凶門，宜靜不宜動、謹防口舌傷損' }[jx]
      return `${r.阴阳}遁${r.局数}局（${r.节气}·${r.三元}），值符「${r.值符}」加臨${r.值符落宫}宮，值使「${r.值使}」落${r.值使落宫}宮，${t}。三吉門開、休、生所臨之方為此刻較得氣之方位（盤中朱砂標示）。`
    },
  },

  meihua: {
    id: 'meihua', name: '梅花易數',
    input: MeihuaInput, board: MeihuaBoard,
    run(options) {
      if (options.mode === 'count') {
        const upper = Number(options.n1), lower = Number(options.n2), moving = options.n3 ? Number(options.n3) : undefined
        const r = qiGuaByCounts(upper, lower, moving)
        r.source = { mode: 'count', upper, lower, moving }
        return r
      }
      const { y, m, d, h } = parseDate(options.date)
      const li = lunarInfo(y, m, d, h)
      const yz = yearZhiNum(li.yearGZ), mo = li.lunarMonth, da = li.lunarDay, hz = hourZhiNum(h)
      const r = qiGuaByTimeNums(yz, mo, da, hz)
      r.source = { mode: 'time', yearZhiNum: yz, monthNum: mo, dayNum: da, hourZhiNum: hz }
      return r
    },
    summary(r) {
      return {
        pillars: [
          { k: '本卦', v: r.main.fullName }, { k: '互卦', v: r.mutual.fullName },
          { k: '變卦', v: r.changed.fullName }, { k: '動爻', v: '第' + r.movingLine + '爻' },
        ],
        headline: r.main.fullName,
        sub: `${REL_TXT[r.relation]}`,
        kv: [
          { k: '體卦', v: `${r.body}（${r.bodyElem}）` },
          { k: '用卦', v: `${r.use}（${r.useElem}）` },
          { k: '五行', v: `${r.bodyElem} 對 ${r.useElem}` },
        ],
      }
    },
  },

  zhouyi: {
    id: 'zhouyi', name: '周易六爻',
    input: ZhouyiInput, board: ZhouyiBoard,
    run(options) {
      const { y, m, d, h } = parseDate(options.date)
      const li = lunarInfo(y, m, d, h)
      const mode = options.mode || 'time'
      let ys
      if (mode === 'manual') ys = options.yaoString || '787978'
      else if (mode === 'count') ys = countQiGua(Number(options.n1), Number(options.n2), Number(options.n3))
      else ys = timeQiGua(yearZhiNum(li.yearGZ), li.lunarMonth, li.lunarDay, hourZhiNum(h))
      const r = decodePan(ys, li.dayGZ)
      r.source = { mode }
      return r
    },
    summary(r) {
      const dong = r.dongYao.length ? r.dongYao.map((p) => '第' + p + '爻').join('、') : '六爻皆靜'
      return {
        pillars: [
          { k: '本卦', v: r.benGua.fullName }, { k: '之卦', v: r.zhiGua.fullName },
          { k: '宮', v: r.benGua.gongElem + '宮' }, { k: '日辰', v: r.dayGanZhi },
        ],
        headline: r.benGua.fullName,
        sub: `${r.benGua.gongElem}宮 · 世${r.benGua.shi}應${r.benGua.ying}`,
        kv: [
          { k: '互卦', v: r.huGua.fullName },
          { k: '動爻', v: dong },
          { k: '旬空', v: r.xunKong.join('') },
        ],
      }
    },
  },
}

// 数据源 = 断语来源等级过滤器（复用 finding.sourceLevel，随「方法 × 等级」联动）
// levels 为「包含的等级」；顺序即可靠度：明確規則 > 主題規則 > 案例 > 象意
export const DATASOURCES = {
  all: {
    id: 'all', name: '全部等級',
    levels: ['明確規則', '主題規則', '案例', '象意'],
  },
  theme: {
    id: 'theme', name: '明確 + 主題規則',
    levels: ['明確規則', '主題規則'],
  },
  explicit: {
    id: 'explicit', name: '僅明確規則',
    levels: ['明確規則'],
  },
}
