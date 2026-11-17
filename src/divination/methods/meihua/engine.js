// 梅花易数排盘引擎（纯函数，无依赖）
// 起卦 → 本卦/变卦/互卦/错卦/综卦 → 体用 → 五行关系
// 参照 meihua-ts-lib 交叉验证

// 先天八卦：乾1兑2离3震4巽5坎6艮7坤8
export const TRIGRAM_NUM = { 乾: 1, 兑: 2, 离: 3, 震: 4, 巽: 5, 坎: 6, 艮: 7, 坤: 8 };
export const NUM_TRIGRAM = { 1: '乾', 2: '兑', 3: '离', 4: '震', 5: '巽', 6: '坎', 7: '艮', 8: '坤' };
// 三爻（自下而上）：1=阳 0=阴
export const TRIGRAM_LINES = {
  乾: [1, 1, 1], 兑: [1, 1, 0], 离: [1, 0, 1], 震: [1, 0, 0],
  巽: [0, 1, 1], 坎: [0, 1, 0], 艮: [0, 0, 1], 坤: [0, 0, 0],
};
export const TRIGRAM_ELEM = { 乾: '金', 兑: '金', 离: '火', 震: '木', 巽: '木', 坎: '水', 艮: '土', 坤: '土' };
export const TRIGRAM_NATURE = { 乾: '天', 兑: '泽', 离: '火', 震: '雷', 巽: '风', 坎: '水', 艮: '山', 坤: '地' };

// 六十四卦（上卦+下卦 → 卦名，简体，与参照库一致）
export const HEX64 = {
  '乾乾': '乾为天', '乾兑': '天泽履', '乾离': '天火同人', '乾震': '天雷无妄', '乾巽': '天风姤', '乾坎': '天水讼', '乾艮': '天山遁', '乾坤': '天地否',
  '兑乾': '泽天夬', '兑兑': '兑为泽', '兑离': '泽火革', '兑震': '泽雷随', '兑巽': '泽风大过', '兑坎': '泽水困', '兑艮': '泽山咸', '兑坤': '泽地萃',
  '离乾': '火天大有', '离兑': '火泽睽', '离离': '离为火', '离震': '火雷噬嗑', '离巽': '火风鼎', '离坎': '火水未济', '离艮': '火山旅', '离坤': '火地晋',
  '震乾': '雷天大壮', '震兑': '雷泽归妹', '震离': '雷火丰', '震震': '震为雷', '震巽': '雷风恒', '震坎': '雷水解', '震艮': '雷山小过', '震坤': '雷地豫',
  '巽乾': '风天小畜', '巽兑': '风泽中孚', '巽离': '风火家人', '巽震': '风雷益', '巽巽': '巽为风', '巽坎': '风水涣', '巽艮': '风山渐', '巽坤': '风地观',
  '坎乾': '水天需', '坎兑': '水泽节', '坎离': '水火既济', '坎震': '水雷屯', '坎巽': '水风井', '坎坎': '坎为水', '坎艮': '水山蹇', '坎坤': '水地比',
  '艮乾': '山天大畜', '艮兑': '山泽损', '艮离': '山火贲', '艮震': '山雷颐', '艮巽': '山风蛊', '艮坎': '山水蒙', '艮艮': '艮为山', '艮坤': '山地剥',
  '坤乾': '地天泰', '坤兑': '地泽临', '坤离': '地火明夷', '坤震': '地雷复', '坤巽': '地风升', '坤坎': '地水师', '坤艮': '地山谦', '坤坤': '坤为地',
};

const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

// 由上下卦得六爻（自下而上：下卦三爻 + 上卦三爻）
function sixLines(upper, lower) {
  return [...TRIGRAM_LINES[lower], ...TRIGRAM_LINES[upper]];
}
// 由六爻反推上下卦
function linesToTrigrams(lines) {
  const lower = lines.slice(0, 3), upper = lines.slice(3, 6);
  const find = (ls) => Object.keys(TRIGRAM_LINES).find((k) => TRIGRAM_LINES[k].join('') === ls.join(''));
  return { upper: find(upper), lower: find(lower) };
}

// 核心：由上下卦 + 动爻 起盘
export function qiGua(upper, lower, movingLine) {
  const mainLines = sixLines(upper, lower);
  // 变卦：动爻阴阳互换（爻序自下而上，1=初爻）
  const changedLines = mainLines.slice();
  changedLines[movingLine - 1] = changedLines[movingLine - 1] === 1 ? 0 : 1;
  // 互卦：本卦 2,3,4 爻为下互；3,4,5 爻为上互
  const mutualLines = [
    mainLines[1], mainLines[2], mainLines[3], // 下互(2,3,4)
    mainLines[2], mainLines[3], mainLines[4], // 上互(3,4,5)
  ];
  // 错卦：全爻阴阳互换
  const oppositeLines = mainLines.map((x) => (x === 1 ? 0 : 1));
  // 综卦：本卦颠倒
  const reversedLines = [...mainLines].reverse();

  const changed = linesToTrigrams(changedLines);
  const mutual = linesToTrigrams(mutualLines);
  const opposite = linesToTrigrams(oppositeLines);
  const reversed = linesToTrigrams(reversedLines);

  const name = (u, l) => ({ upper: u, lower: l, fullName: HEX64[u + l] });

  // 体用：动爻在上卦(4/5/6)→用=上卦、体=下卦；动爻在下卦(1/2/3)→用=下卦、体=上卦
  const body = movingLine >= 4 ? lower : upper;
  const use = movingLine >= 4 ? upper : lower;

  return {
    main: name(upper, lower),
    changed: name(changed.upper, changed.lower),
    mutual: name(mutual.upper, mutual.lower),
    opposite: name(opposite.upper, opposite.lower),
    reversed: name(reversed.upper, reversed.lower),
    movingLine,
    lines: { main: mainLines, changed: changedLines, mutual: mutualLines },
    body, use,
    bodyElem: TRIGRAM_ELEM[body], useElem: TRIGRAM_ELEM[use],
    relation: elementRelation(TRIGRAM_ELEM[body], TRIGRAM_ELEM[use]),
  };
}

function elementRelation(bodyElem, useElem) {
  if (bodyElem === useElem) return 'same';
  if (SHENG[useElem] === bodyElem) return 'useGeneratesBody';
  if (SHENG[bodyElem] === useElem) return 'bodyGeneratesUse';
  if (KE[useElem] === bodyElem) return 'useControlsBody';
  if (KE[bodyElem] === useElem) return 'bodyControlsUse';
}

// 报数起卦：上卦=upper%8(余0作8)，下卦=lower%8，动爻=moving%6(余0作6，缺省 upper+lower)
export function qiGuaByCounts(upper, lower, moving) {
  const u = upper % 8 === 0 ? 8 : upper % 8;
  const l = lower % 8 === 0 ? 8 : lower % 8;
  const mv = moving == null ? (upper + lower) : moving;
  const m = mv % 6 === 0 ? 6 : mv % 6;
  return qiGua(NUM_TRIGRAM[u], NUM_TRIGRAM[l], m);
}

// 时间起卦：年支数(子1..亥12) + 农历月 + 农历日 + 时支数(子1..亥12)
export function qiGuaByTimeNums(yearZhiNum, monthNum, dayNum, hourZhiNum) {
  const u = (yearZhiNum + monthNum + dayNum) % 8 || 8;
  const l = (yearZhiNum + monthNum + dayNum + hourZhiNum) % 8 || 8;
  const m = (yearZhiNum + monthNum + dayNum + hourZhiNum) % 6 || 6;
  return qiGua(NUM_TRIGRAM[u], NUM_TRIGRAM[l], m);
}
