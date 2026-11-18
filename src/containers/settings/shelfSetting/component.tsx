import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Trans } from "react-i18next";
import toast from "react-hot-toast";
import { ConfigService } from "../../../assets/lib/kookit-extra-browser.min";
import {
  DivinationCategory,
  getDivinationCategories,
  setDivinationCategories,
} from "../../../constants/divinationCategory";

const ShelfSetting = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<DivinationCategory[]>(() =>
    getDivinationCategories()
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPinyin, setNewCategoryPinyin] = useState("");
  const [expandedShelfCat, setExpandedShelfCat] = useState<number | null>(null);

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

  return (
    <>
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
            <span
              style={{
                cursor: "pointer",
                color: "#0078d4",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
              onClick={() =>
                setExpandedShelfCat(expandedShelfCat === index ? null : index)
              }
            >
              {expandedShelfCat === index ? t("Collapse") : t("Bookshelf")}
            </span>
          </div>
          {expandedShelfCat === index && (
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
          )}
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
    </>
  );
};

export default ShelfSetting;
