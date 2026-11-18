import { useEffect } from "react";
import { AppProvider, useApp } from "../../divination/core/AppContext.jsx";
import {
  METHODS,
  DATASOURCES,
} from "../../divination/config/methods.config.jsx";
import layoutConfig from "../../divination/config/layout.config.js";
import InfoPanel from "../../divination/modules/InfoPanel.jsx";
import DuanYuPanel from "../../divination/modules/DuanYuPanel.jsx";
import { useAppStore } from "../../store/useAppStore";
import "../../divination/divination.css";
import "./divination-page.css";

// 典籍类型 → 占断方法映射（跟随左侧菜单上端的典籍类型下拉）
const CATEGORY_METHOD: Record<string, string> = {
  梅花: "meihua",
  六爻: "zhouyi",
  奇门: "qimen",
};

function TwoColumn() {
  const category = useAppStore((s) => s.sidebar.category);
  const isCollapsed = useAppStore((s) => s.sidebar.isCollapsed);
  // AppContext.jsx 为 qimen-react 移植的 JS 模块，无 TS 类型，这里显式断言
  const { switchMethod, method, result, run, options, setOptions } = useApp() as any;
  const methodId = CATEGORY_METHOD[category] || "meihua";

  useEffect(() => {
    switchMethod(methodId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const Input = method.input;
  const Board = method.board;

  return (
    <div
      className="divination-two-col"
      style={
        isCollapsed
          ? { width: "calc(100vw - 70px)", left: "70px" }
          : {}
      }
    >
      <div className="divination-left">
        <div className="divination-method-title">{method.name}</div>
        <Input value={options} onChange={setOptions} />
        <button className="pai" onClick={() => run(options)}>
          排 盤
        </button>
        <InfoPanel />
        <DuanYuPanel />
      </div>
      <div className="divination-right">
        {result ? (
          <Board result={result} />
        ) : (
          <div className="board-empty">點擊「排 盤」後於此顯示盤面</div>
        )}
      </div>
    </div>
  );
}

export default function DivinationPage() {
  return (
    <AppProvider
      methods={METHODS}
      datasources={DATASOURCES}
      layoutConfig={layoutConfig}
    >
      <TwoColumn />
    </AppProvider>
  );
}
