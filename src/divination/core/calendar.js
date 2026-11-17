// 农历/干支换算（梅花、六爻时间起卦用）
import { Solar } from 'lunar-javascript'

const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 公历 → 农历/干支信息
export function lunarInfo(y, m, d, h) {
  const lunar = Solar.fromYmdHms(y, m, d, h, 0, 0).getLunar()
  const ec = lunar.getEightChar()
  return {
    yearGZ: ec.getYear(),          // 年干支
    monthGZ: ec.getMonth(),        // 月干支
    dayGZ: ec.getDay(),            // 日干支
    hourGZ: ec.getTime(),          // 时干支
    lunarMonth: Math.abs(lunar.getMonth()), // 农历月
    lunarDay: lunar.getDay(),      // 农历日
  }
}

// 时支数（子1..亥12）
export function hourZhiNum(hour) {
  return (Math.floor((hour + 1) / 2) % 12) + 1
}

// 年支数（子1..亥12）
export function yearZhiNum(yearGZ) {
  return ZHI.indexOf(yearGZ[1]) + 1
}
