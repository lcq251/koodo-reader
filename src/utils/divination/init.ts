import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";
import DatabaseService from "../storage/databaseService";
import BookUtil from "../file/bookUtil";
import {
  DIVINATION_CATEGORY_CONFIG_KEY,
  DEFAULT_DIVINATION_CATEGORIES,
  setDivinationCategories,
} from "../../constants/divinationCategory";

export interface DemoBook {
  key: string;
  name: string;
  author: string;
  shelf: string;
  content: string;
}

// 功能测试用的内置示例书（真实古籍原文片段，用于验证典籍类型过滤与阅读）
const DEMO_BOOKS: DemoBook[] = [
  {
    key: "demo-meihuayishu",
    name: "梅花易数",
    author: "邵雍",
    shelf: "梅花",
    content: `《梅花易数》
【宋】邵雍 撰

梅花易数，全称《新定邵康节先生观梅拆字数全集》，相传为宋代邵雍（康节先生）所著，因"观梅占"得名。

观梅占（辰年十二月十七日申时）

辰年五数，十二月十二数，十七日十七数，共三十四数。三十四除以八，余二，属兑，为上卦；加申时九数，共四十三数，四十三除以八，余三，属离，为下卦；上下卦共得泽火革。又四十三除以六，余一，初爻动，变泽山咸，互见乾巽。

断曰：明晚当有女子折花，园丁不知而逐之，女子失惊坠地，遂伤其股。右兑金为体，离火克之，互中巽木复生起离火，则克体之卦气盛，兑为少女，因知女子被伤；而互中巽木又逢乾金兑金克之，则巽木被伤，巽为股，故有伤股之应。

体用生克，为梅花易数断卦之纲要。凡占卜，以体卦为主，用卦为客，观其生克比和，而断吉凶悔吝。
`,
  },
  {
    key: "demo-zhouyi",
    name: "周易",
    author: "佚名",
    shelf: "六爻",
    content: `《周易》

《周易》即《易经》，为群经之首，分《经》《传》两部分。《经》含六十四卦卦辞与三百八十四爻辞；《传》含《彖》《象》《系辞》《文言》《说卦》《序卦》《杂卦》七种十篇，合称"十翼"。

乾卦第一

乾：元，亨，利，贞。
初九：潜龙勿用。
九二：见龙在田，利见大人。
九三：君子终日乾乾，夕惕若厉，无咎。
九四：或跃在渊，无咎。
九五：飞龙在天，利见大人。
上九：亢龙有悔。
用九：见群龙无首，吉。

坤卦第二

坤：元，亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。
初六：履霜，坚冰至。
六二：直方大，不习无不利。
六三：含章可贞，或从王事，无成有终。
六四：括囊，无咎无誉。
六五：黄裳，元吉。
上六：龙战于野，其血玄黄。
用六：利永贞。
`,
  },
];

export async function initDivinationDemoData(): Promise<boolean> {
  // 已初始化则跳过（幂等）
  if (ConfigService.getReaderConfig(DIVINATION_CATEGORY_CONFIG_KEY)) {
    return false;
  }

  // 1. 建默认分类书架（梅花 / 六爻 / 奇门）
  const shelfList = ConfigService.getAllMapConfig("shelfList") || {};
  DEFAULT_DIVINATION_CATEGORIES.forEach((cat) => {
    cat.shelves.forEach((shelf) => {
      if (!shelfList.hasOwnProperty(shelf)) {
        ConfigService.setOneMapConfig(shelf, [], "shelfList");
        ConfigService.setListConfig(shelf, "sortedShelfList");
      }
    });
  });

  // 2. 插入示例书元数据 + 文件内容，并归入对应书架
  const encoder = new TextEncoder();
  const existingKeys = new Set(
    await DatabaseService.getAllRecordKeys("books")
  );
  for (const book of DEMO_BOOKS) {
    if (existingKeys.has(book.key)) continue;
    await DatabaseService.saveRecord(
      {
        key: book.key,
        name: book.name,
        author: book.author,
        description: "",
        md5: book.key,
        cover: "",
        format: "txt",
        publisher: "",
        size: encoder.encode(book.content).byteLength,
        page: 0,
        path: "",
        charset: "utf-8",
        published: "",
        modified: "",
        identifier: "",
        language: "zh",
        subject: "",
        rights: "",
        isbn: "",
        layout: "",
      },
      "books"
    );
    await BookUtil.addBook(book.key, "txt", encoder.encode(book.content).buffer);
    ConfigService.setMapConfig(book.shelf, book.key, "shelfList");
  }

  // 3. 写默认典籍类型配置（含拼音）
  setDivinationCategories(DEFAULT_DIVINATION_CATEGORIES);

  return true;
}
