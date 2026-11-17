// 书箱注册表：书籍种类 → 默认占断方法 + 中栏内容类型 + 多媒体资料
// 新增书箱 = 在此加一项；如需新中栏类型，在 MiddleColumn.jsx 加对应渲染器即可。
export const BOOKS = {
  meihua: {
    id: 'meihua', name: '梅花易數', icon: '梅',
    method: 'meihua',            // 默认关联的占断方法
    middle: 'dimensions',        // 中栏渲染器：分类维度（易理/方法/断言/象意/案例）
    media: {
      videos: [{ title: '梅花易數起卦入門', url: '', note: '待補充視頻連結' }],
      images: [{ title: '八卦方位圖', url: '', note: '待補充圖片' }],
    },
  },
  zhouyi: {
    id: 'zhouyi', name: '周易', icon: '周',
    method: 'zhouyi',
    middle: 'hexagrams',         // 中栏渲染器：六十四卦列表
    media: {
      videos: [{ title: '周易六爻納甲', url: '', note: '待補充視頻連結' }],
      images: [{ title: '六十四卦方圓圖', url: '', note: '待補充圖片' }],
    },
  },
  qimen: {
    id: 'qimen', name: '奇門遁甲', icon: '奇',
    method: 'qimen',
    middle: 'chapters',          // 中栏渲染器：章节（奇门典籍待补充）
    media: {
      videos: [{ title: '奇門遁甲排盤', url: '', note: '待補充視頻連結' }],
      images: [{ title: '九宮八卦圖', url: '', note: '待補充圖片' }],
    },
  },
}

// 书箱 → 占断方法 映射（多对多 + 默认）。首个即默认方法，其余为「被引用」的关联方法。
export const BOOK_METHOD_MAP = {
  meihua: ['meihua'],
  zhouyi: ['zhouyi', 'meihua'],  // 周易既是六爻来源，又被梅花「先看周易爻辞」引用
  qimen: ['qimen'],
}

// 取书箱默认方法
export function bookDefaultMethod(bookId) {
  return (BOOK_METHOD_MAP[bookId] || [BOOKS[bookId]?.method])[0]
}

// 取书箱关联的全部方法
export function bookMethods(bookId) {
  return BOOK_METHOD_MAP[bookId] || [BOOKS[bookId]?.method]
}
