// 动态排盘引擎加载器：用 new Function 运行时执行用户粘贴的排盘代码
// 约定：代码必须定义 run(options) 函数，接收 { y, m, d, h } 并返回排盘结果
import { Lunar } from "lunar-javascript";
import { tradify } from "../core/tradify.js";

// 注入给动态排盘代码的依赖（历法 + 繁简转换）
const INJECT = { Lunar, tradify };

export function parseDate(dateStr) {
  const [date, time] = (dateStr || "2024-06-15T10:00").split("T");
  const [y, m, d] = date.split("-").map(Number);
  const h = parseInt((time || "00:00").split(":")[0], 10);
  return { y, m, d, h };
}

// 执行排盘代码，返回 run 函数
export function loadRun(code) {
  const factory = new Function(
    "inject",
    `
      "use strict";
      ${code}
      if (typeof run !== 'function') {
        throw new Error('排盘代码必须定义 run(options) 函数');
      }
      return run;
    `
  );
  return factory(INJECT);
}
