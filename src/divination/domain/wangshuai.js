// 时令旺衰（旺相休囚死）：据农历月判断季节，查体卦五行的旺衰状态
import wangshuaiData from '../data/wangshuai.json'

// 农历月 → 季节（寅卯=春、巳午=夏、申酉=秋、亥子=冬、辰戌丑未=四季土）
function seasonOf(month) {
  if (month === 3 || month === 6 || month === 9 || month === 12) return '四季'
  if (month === 1 || month === 2) return '春'
  if (month === 4 || month === 5) return '夏'
  if (month === 7 || month === 8) return '秋'
  return '冬'
}

// 某五行在某季节的旺衰状态（旺/相/休/囚/死）
export function wangshuaiOf(elem, month) {
  if (!elem || !month) return null
  const season = seasonOf(month)
  const table = wangshuaiData.seasons[season]
  for (const [state, e] of Object.entries(table)) {
    if (e === elem) return { season, state }
  }
  return { season, state: null }
}
