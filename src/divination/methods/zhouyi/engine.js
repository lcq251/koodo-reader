// 周易六爻（纳甲筮法）排盘引擎 —— 纯函数，无依赖
// 起卦 → 本卦/之卦/互卦 → 纳甲纳支 → 安世应 → 装六亲 → 装六神 → 旬空
// 参照 iching-shifa 交叉验证
import { HEX64, TRIGRAM_LINES, TRIGRAM_ELEM } from '../meihua/engine.js';

const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZHI_ELEM = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };

// 纳支：内卦(初二三)、外卦(四五上)
const NAZHI_NEI = { 乾: ['子', '寅', '辰'], 坎: ['寅', '辰', '午'], 艮: ['辰', '午', '申'], 震: ['子', '寅', '辰'], 巽: ['丑', '亥', '酉'], 离: ['卯', '丑', '亥'], 坤: ['未', '巳', '卯'], 兑: ['巳', '卯', '丑'] };
const NAZHI_WAI = { 乾: ['午', '申', '戌'], 坎: ['申', '戌', '子'], 艮: ['戌', '子', '寅'], 震: ['午', '申', '戌'], 巽: ['未', '巳', '卯'], 离: ['酉', '未', '巳'], 坤: ['丑', '亥', '酉'], 兑: ['亥', '酉', '未'] };
// 纳甲（天干）：乾内甲外壬，坤内乙外癸，余内外同
const NAGAN_NEI = { 乾: '甲', 坤: '乙', 震: '庚', 巽: '辛', 坎: '戊', 离: '己', 艮: '丙', 兑: '丁' };
const NAGAN_WAI = { 乾: '壬', 坤: '癸', 震: '庚', 巽: '辛', 坎: '戊', 离: '己', 艮: '丙', 兑: '丁' };

// 六十四卦 → 宫五行 + 世爻位置（据 iching-shifa 枚举）
const GONG_TABLE = {
  '乾为天': { e: '金', s: 6 }, '天泽履': { e: '土', s: 5 }, '天火同人': { e: '火', s: 3 }, '天雷无妄': { e: '木', s: 4 }, '天风姤': { e: '金', s: 1 }, '天水讼': { e: '火', s: 4 }, '天山遁': { e: '金', s: 2 }, '天地否': { e: '金', s: 3 },
  '泽天夬': { e: '土', s: 5 }, '兑为泽': { e: '金', s: 6 }, '泽火革': { e: '水', s: 4 }, '泽雷随': { e: '木', s: 3 }, '泽风大过': { e: '木', s: 4 }, '泽水困': { e: '金', s: 1 }, '泽山咸': { e: '金', s: 3 }, '泽地萃': { e: '金', s: 2 },
  '火天大有': { e: '金', s: 3 }, '火泽睽': { e: '土', s: 4 }, '离为火': { e: '火', s: 6 }, '火雷噬嗑': { e: '木', s: 5 }, '火风鼎': { e: '火', s: 2 }, '火水未济': { e: '火', s: 3 }, '火山旅': { e: '火', s: 1 }, '火地晋': { e: '金', s: 4 },
  '雷天大壮': { e: '土', s: 4 }, '雷泽归妹': { e: '金', s: 3 }, '雷火丰': { e: '水', s: 5 }, '震为雷': { e: '木', s: 6 }, '雷风恒': { e: '木', s: 3 }, '雷水解': { e: '木', s: 2 }, '雷山小过': { e: '金', s: 4 }, '雷地豫': { e: '木', s: 1 },
  '风天小畜': { e: '木', s: 1 }, '风泽中孚': { e: '土', s: 4 }, '风火家人': { e: '木', s: 2 }, '风雷益': { e: '木', s: 3 }, '巽为风': { e: '木', s: 6 }, '风水涣': { e: '火', s: 5 }, '风山渐': { e: '土', s: 3 }, '风地观': { e: '金', s: 4 },
  '水天需': { e: '土', s: 4 }, '水泽节': { e: '水', s: 1 }, '水火既济': { e: '水', s: 3 }, '水雷屯': { e: '水', s: 2 }, '水风井': { e: '木', s: 5 }, '坎为水': { e: '水', s: 6 }, '水山蹇': { e: '金', s: 4 }, '水地比': { e: '土', s: 3 },
  '山天大畜': { e: '土', s: 2 }, '山泽损': { e: '土', s: 3 }, '山火贲': { e: '土', s: 1 }, '山雷颐': { e: '木', s: 4 }, '山风蛊': { e: '木', s: 3 }, '山水蒙': { e: '火', s: 4 }, '艮为山': { e: '土', s: 6 }, '山地剥': { e: '金', s: 5 },
  '地天泰': { e: '土', s: 3 }, '地泽临': { e: '土', s: 2 }, '地火明夷': { e: '水', s: 4 }, '地雷复': { e: '土', s: 1 }, '地风升': { e: '木', s: 4 }, '地水师': { e: '水', s: 3 }, '地山谦': { e: '金', s: 5 }, '坤为地': { e: '土', s: 6 },
};

const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
const LIUSHOU_ORDER = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'];
const LIUSHOU_START = { 甲: '青龙', 乙: '青龙', 丙: '朱雀', 丁: '朱雀', 戊: '勾陈', 己: '腾蛇', 庚: '白虎', 辛: '白虎', 壬: '玄武', 癸: '玄武' };
// 六十甲子旬空
const SIX_XUNS = {
  '甲子': ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉'],
  '甲戌': ['甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未'],
  '甲申': ['甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳'],
  '甲午': ['甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯'],
  '甲辰': ['甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑'],
  '甲寅': ['甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'],
};
const XUN_KONG = { 甲子: ['戌', '亥'], 甲戌: ['申', '酉'], 甲申: ['午', '未'], 甲午: ['辰', '巳'], 甲辰: ['寅', '卯'], 甲寅: ['子', '丑'] };

function findTrigram(lines) {
  return Object.keys(TRIGRAM_LINES).find((k) => TRIGRAM_LINES[k].join('') === lines.join(''));
}

// 六爻纳甲（自下而上）
function najia(upper, lower) {
  const nei = NAZHI_NEI[lower], wai = NAZHI_WAI[upper];
  return [
    NAGAN_NEI[lower] + nei[0], NAGAN_NEI[lower] + nei[1], NAGAN_NEI[lower] + nei[2],
    NAGAN_WAI[upper] + wai[0], NAGAN_WAI[upper] + wai[1], NAGAN_WAI[upper] + wai[2],
  ];
}

// 单卦排盘（本卦或之卦）
function decodeGua(yinYang, dayGan, gongElem) {
  const lower = findTrigram(yinYang.slice(0, 3));
  const upper = findTrigram(yinYang.slice(3, 6));
  const fullName = HEX64[upper + lower];
  const info = GONG_TABLE[fullName];
  const gong = gongElem || info.e; // 之卦六亲沿用本卦宫五行
  const shi = info.s;
  const ying = ((shi + 2) % 6) + 1; // 应=世+3 (mod 6, 1-based)
  const njs = najia(upper, lower);
  const startIdx = LIUSHOU_ORDER.indexOf(LIUSHOU_START[dayGan]);
  const yaoList = yinYang.map((yy, i) => {
    const zhi = njs[i][1];
    const yaoElem = ZHI_ELEM[zhi];
    let liuQin;
    if (yaoElem === gong) liuQin = '兄弟';
    else if (SHENG[gong] === yaoElem) liuQin = '子孙';
    else if (SHENG[yaoElem] === gong) liuQin = '父母';
    else if (KE[gong] === yaoElem) liuQin = '妻财';
    else liuQin = '官鬼';
    const liuShou = LIUSHOU_ORDER[(startIdx + i) % 6];
    const pos = i + 1;
    return { position: pos, naJia: njs[i], liuQin, liuShou, shiYing: pos === shi ? '世' : pos === ying ? '应' : '', yinYang: yy };
  });
  return { fullName, upper, lower, gong, gongElem: info.e, shi, ying, yaoList };
}

function xunKong(dayGanZhi) {
  for (const [xun, arr] of Object.entries(SIX_XUNS)) {
    if (arr.includes(dayGanZhi)) return XUN_KONG[xun];
  }
  return [];
}

// 核心排盘：yaoString 六爻值(6/7/8/9，自下而上) + 日干支
export function decodePan(yaoString, dayGanZhi) {
  const vals = yaoString.split('').map(Number);
  const benYY = vals.map((v) => (v === 7 || v === 9) ? 1 : 0);
  const zhiYY = benYY.map((x, i) => (vals[i] === 6 || vals[i] === 9) ? (x ? 0 : 1) : x);
  const dong = vals.map((v, i) => (v === 6 || v === 9) ? i + 1 : 0).filter(Boolean);

  const dayGan = dayGanZhi[0];
  const benGua = decodeGua(benYY, dayGan, null);
  const zhiGua = decodeGua(zhiYY, dayGan, benGua.gongElem); // 之卦六亲沿用本卦宫
  // 互卦（据 iching-shifa 约定：取之卦 2/3/4 下互、3/4/5 上互）
  const huLower = findTrigram(zhiYY.slice(1, 4));
  const huUpper = findTrigram(zhiYY.slice(2, 5));
  const huGua = { fullName: HEX64[huUpper + huLower], upper: huUpper, lower: huLower };

  return {
    yaoString, dayGanZhi,
    benGua, zhiGua, huGua,
    dongYao: dong,
    xunKong: xunKong(dayGanZhi),
  };
}

// —— 起卦（产生 yaoString）——
// 时间起卦：梅花式取数，年支数+农历月+农历日 上卦，+时支数 下卦，总和动爻
export function timeQiGua(yearZhiNum, monthNum, dayNum, hourZhiNum) {
  const u = (yearZhiNum + monthNum + dayNum) % 8 || 8;
  const l = (yearZhiNum + monthNum + dayNum + hourZhiNum) % 8 || 8;
  const moving = (yearZhiNum + monthNum + dayNum + hourZhiNum) % 6 || 6;
  return buildYaoString(u, l, moving);
}
// 报数起卦：三数（上卦、下卦、动爻）
export function countQiGua(n1, n2, n3) {
  const u = n1 % 8 || 8, l = n2 % 8 || 8, moving = n3 % 6 || 6;
  return buildYaoString(u, l, moving);
}
// 由先天卦数 + 动爻 生成六爻串（单动爻）
function buildYaoString(uNum, lNum, moving) {
  const NUM = { 1: '乾', 2: '兑', 3: '离', 4: '震', 5: '巽', 6: '坎', 7: '艮', 8: '坤' };
  const upper = NUM[uNum], lower = NUM[lNum];
  const yy = [...TRIGRAM_LINES[lower], ...TRIGRAM_LINES[upper]]; // 自下而上
  return yy.map((x, i) => {
    if (i + 1 === moving) return x ? 9 : 6; // 动爻：阳动9 阴动6
    return x ? 7 : 8;
  }).join('');
}
