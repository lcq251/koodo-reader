import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Trans } from "react-i18next";
import { changeLanguage as changeI18nLanguage } from "../../../i18n";
import { isElectron } from "react-device-detect";
import {
  generalSettingList,
  langList,
  searchList,
} from "../../../constants/settingList";

import toast from "react-hot-toast";
import { ConfigService } from "../../../assets/lib/kookit-extra-browser.min";
import SwitchRow from "../../../components/readerSettings/switchRow";
import {
  DivinationCategory,
  getDivinationCategories,
  setDivinationCategories,
} from "../../../constants/divinationCategory";

export interface SettingInfoState {
  isMergeWord: boolean;

  isImportPath: boolean;

  isDisableTrashBin: boolean;
  isDeleteShelfBook: boolean;
  isPreventSleep: boolean;
  isAlwaysOnTop: boolean;
  isAutoMaximizeWin: boolean;
  isAutoLaunch: boolean;
  isMinimizeToTray: boolean;
  isOpenInMain: boolean;
  isDisableUpdate: boolean;
  isExportOriginalName: boolean;
  isDisableAI: boolean;
  isUseOriginalName: boolean;
  isAIAnalyzeTitle: boolean;
  isPrecacheBook: boolean;
  isUseBuiltIn: boolean;
  isDeleteOriginal: boolean;

  isHideShelfBook: boolean;
  isPreventAdd: boolean;
  startupShelf: string;
}

declare var window: any;
const GeneralSetting = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<Record<string, any>>({
    isImportPath: ConfigService.getReaderConfig("isImportPath") === "yes",
    isMergeWord: ConfigService.getReaderConfig("isMergeWord") === "yes",
    isPreventAdd: ConfigService.getReaderConfig("isPreventAdd") === "yes",
    isDisableTrashBin:
      ConfigService.getReaderConfig("isDisableTrashBin") === "yes",
    isDeleteShelfBook:
      ConfigService.getReaderConfig("isDeleteShelfBook") === "yes",
    isHideShelfBook:
      ConfigService.getReaderConfig("isHideShelfBook") === "yes",
    isPreventSleep: ConfigService.getReaderConfig("isPreventSleep") === "yes",
    isAlwaysOnTop: ConfigService.getReaderConfig("isAlwaysOnTop") === "yes",
    isAutoMaximizeWin:
      ConfigService.getReaderConfig("isAutoMaximizeWin") === "yes",
    isAutoLaunch: ConfigService.getReaderConfig("isAutoLaunch") === "yes",
    isMinimizeToTray:
      ConfigService.getReaderConfig("isMinimizeToTray") === "yes",
    isOpenInMain: ConfigService.getReaderConfig("isOpenInMain") === "yes",
    isDisableAI: ConfigService.getReaderConfig("isDisableAI") === "yes",
    isUseOriginalName:
      ConfigService.getReaderConfig("isUseOriginalName") === "yes",
    isAIAnalyzeTitle:
      ConfigService.getReaderConfig("isAIAnalyzeTitle") === "yes",
    isExportOriginalName:
      ConfigService.getReaderConfig("isExportOriginalName") === "yes",
    isDisableUpdate:
      ConfigService.getReaderConfig("isDisableUpdate") === "yes",
    isPrecacheBook: ConfigService.getReaderConfig("isPrecacheBook") === "yes",
    isUseBuiltIn: ConfigService.getReaderConfig("isUseBuiltIn") === "yes",
    isDeleteOriginal:
      ConfigService.getReaderConfig("isDeleteOriginal") === "yes",
    startupShelf: ConfigService.getReaderConfig("startupShelf") || "",
  });
  const [searchEngine, setSearchEngine] = useState(
    ConfigService.getReaderConfig("searchEngine") ||
      (navigator.language === "zh-CN" ? "baidu" : "google")
  );
  const [categories, setCategories] = useState<DivinationCategory[]>(() =>
    getDivinationCategories()
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPinyin, setNewCategoryPinyin] = useState("");

  const shelfNameList = () =>
    Object.keys(ConfigService.getAllMapConfig("shelfList") || {});

  const persistCategories = (next: DivinationCategory[]) => {
    setCategories(next);
    setDivinationCategories(next);
  };
  const updateCategory = (
    index: number,
    patch: Partial<DivinationCategory>
  ) => {
    const next = categories.map((c, i) => (i === index ? { ...c, ...patch } : c));
    persistCategories(next);
  };
  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast(t("Shelf Title is Empty"));
      return;
    }
    const next = [
      ...categories,
      { name, pinyin: newCategoryPinyin.trim(), shelves: [] },
    ];
    persistCategories(next);
    setNewCategoryName("");
    setNewCategoryPinyin("");
  };
  const removeCategory = (index: number) => {
    persistCategories(categories.filter((_, i) => i !== index));
  };
  const toggleCategoryShelf = (index: number, shelfName: string) => {
    const cat = categories[index];
    const shelves = cat.shelves.includes(shelfName)
      ? cat.shelves.filter((s) => s !== shelfName)
      : [...cat.shelves, shelfName];
    updateCategory(index, { shelves });
  };

  const handleRest = (_bool: boolean) => {
    toast.success(t("Change successful"));
  };
  const changeLanguage = (lng: string) => {
    changeI18nLanguage(lng);
    ConfigService.setReaderConfig("lang", lng);
  };
  const changeSearch = (nextSearchEngine: string) => {
    ConfigService.setReaderConfig("searchEngine", nextSearchEngine);
    setSearchEngine(nextSearchEngine);
  };
  const handleSetting = (stateName: string) => {
    setState((prev) => ({ ...prev, [stateName]: !prev[stateName] }));
    ConfigService.setReaderConfig(
      stateName,
      state[stateName] ? "no" : "yes"
    );
    handleRest(state[stateName]);
  };

  const handleOpenInMain = () => {
    if (state.isMergeWord && !state.isOpenInMain) {
      toast(t("Please turn off merge with word first"));
      return;
    }
    handleSetting("isOpenInMain");
  };
  const handleAlwaysOnTop = () => {
    const ipcRenderer = window.electronAPI;
    ipcRenderer.invoke("set-always-on-top", {
      isAlwaysOnTop: state.isAlwaysOnTop ? "no" : "yes",
    });
    handleSetting("isAlwaysOnTop");
  };
  const handleMaximizeWin = () => {
    const ipcRenderer = window.electronAPI;
    ipcRenderer.invoke("set-auto-maximize", {
      isAutoMaximizeWin: state.isAutoMaximizeWin ? "no" : "yes",
    });
    handleSetting("isAutoMaximizeWin");
  };
  const handleAutoLaunch = () => {
    const ipcRenderer = window.electronAPI;
    ipcRenderer.invoke("toggle-auto-launch", {
      isAutoLaunch: state.isAutoLaunch ? "no" : "yes",
    });
    handleSetting("isAutoLaunch");
  };
  const handleMinimizeToTray = () => {
    const ipcRenderer = window.electronAPI;
    ipcRenderer.invoke("toggle-minimize-to-tray", {
      isMinimizeToTray: state.isMinimizeToTray ? "no" : "yes",
    });
    handleSetting("isMinimizeToTray");
  };
  const renderSwitchOption = (optionList: any[]) => {
    return optionList.map((item) => {
      return (
        <div
          style={item.isElectron ? (isElectron ? {} : { display: "none" }) : {}}
          key={item.propName}
        >
          <SwitchRow
            variant="setting"
            title={<Trans>{item.title}</Trans>}
            isEnabled={state[item.propName]}
            onClick={() => {
              switch (item.propName) {
                case "isOpenInMain":
                  handleOpenInMain();
                  break;
                case "isAlwaysOnTop":
                  handleAlwaysOnTop();
                  break;
                case "isAutoMaximizeWin":
                  handleMaximizeWin();
                  break;
                case "isAutoLaunch":
                  handleAutoLaunch();
                  break;
                case "isMinimizeToTray":
                  handleMinimizeToTray();
                  break;
                default:
                  handleSetting(item.propName);
                  break;
              }
            }}
          />
          <p className="setting-option-subtitle">
            <Trans>{item.desc}</Trans>
          </p>
        </div>
      );
    });
  };
  const handleResetMainPosition = () => {
    window
      .electronAPI
      .invoke("reset-main-position", "ping");
    toast.success(t("Reset successful"));
  };
  return (
      <>
        {renderSwitchOption(generalSettingList)}

        <div className="setting-dialog-new-title">
          <Trans>Reset main window's position</Trans>

          <span
            className="change-location-button"
            onClick={() => {
              handleResetMainPosition();
            }}
          >
            <Trans>Reset</Trans>
          </span>
        </div>

        <div className="setting-dialog-new-title">
          <Trans>Divination category</Trans>
        </div>
        {categories.map((cat, index) => (
          <div
            key={`${cat.name}-${index}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              padding: "10px 0",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                value={cat.name}
                placeholder={t("Category name")}
                onChange={(event) =>
                  updateCategory(index, { name: event.target.value })
                }
                style={{
                  width: "40%",
                  height: "32px",
                  padding: "0 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(0,0,0,0.15)",
                }}
              />
              <input
                value={cat.pinyin}
                placeholder={t("Pinyin")}
                onChange={(event) =>
                  updateCategory(index, { pinyin: event.target.value })
                }
                style={{
                  width: "40%",
                  height: "32px",
                  padding: "0 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(0,0,0,0.15)",
                }}
              />
              <span
                style={{
                  cursor: "pointer",
                  color: "#d9534f",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
                onClick={() => removeCategory(index)}
              >
                {t("Delete")}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {shelfNameList().map((shelf) => (
                <label
                  key={shelf}
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={cat.shelves.includes(shelf)}
                    onChange={() => toggleCategoryShelf(index, shelf)}
                  />
                  {shelf}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
            alignItems: "center",
          }}
        >
          <input
            value={newCategoryName}
            placeholder={t("New category name")}
            onChange={(event) => setNewCategoryName(event.target.value)}
            style={{
              width: "40%",
              height: "32px",
              padding: "0 8px",
              borderRadius: "6px",
              border: "1px solid rgba(0,0,0,0.15)",
            }}
          />
          <input
            value={newCategoryPinyin}
            placeholder={t("Pinyin")}
            onChange={(event) => setNewCategoryPinyin(event.target.value)}
            style={{
              width: "40%",
              height: "32px",
              padding: "0 8px",
              borderRadius: "6px",
              border: "1px solid rgba(0,0,0,0.15)",
            }}
          />
          <span
            style={{ cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" }}
            onClick={addCategory}
          >
            {t("Add")}
          </span>
        </div>

<div className="setting-dialog-new-title">
          <Trans>Language</Trans>
          <select
            name=""
            className="lang-setting-dropdown"
            value={ConfigService.getReaderConfig("lang") || "en"}
            onChange={(event) => {
              changeLanguage(event.target.value);
            }}
          >
            {langList.map((item) => (
              <option
                value={item.value}
                key={item.value}
                className="lang-setting-option"
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="setting-dialog-new-title">
          <Trans>Default search engine</Trans>
          <select
            name=""
            className="lang-setting-dropdown"
            value={searchEngine}
            onChange={(event) => {
              changeSearch(event.target.value);
            }}
          >
            {searchList.map((item) => (
              <option
                value={item.value}
                key={item.value}
                className="lang-setting-option"
              >
                {t(item.label)}
              </option>
            ))}
          </select>
        </div>
        <div className="setting-dialog-new-title">
          <Trans>Auto switch to shelf on startup</Trans>
          <select
            name=""
            className="lang-setting-dropdown"
            value={state.startupShelf || ""}
            onChange={(event) => {
              const value = event.target.value;
              ConfigService.setReaderConfig("startupShelf", value);
              setState((prev) => ({ ...prev, startupShelf: value }));
              toast.success(t("Change successful"));
            }}
          >
            <option
              value=""
              className="lang-setting-option"
            >
              {t("Disabled")}
            </option>
            {Object.keys(ConfigService.getAllMapConfig("shelfList") || {}).map(
              (shelfName) => (
                <option
                  value={shelfName}
                  key={shelfName}
                  className="lang-setting-option"
                >
                  {shelfName}
                </option>
              )
            )}
          </select>
        </div>
        
      </>
  );
};

export default GeneralSetting;
