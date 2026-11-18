import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Trans } from "react-i18next";
import toast from "react-hot-toast";
import {
  getSteps,
  saveSteps,
  AssertionStep,
} from "../../../divination/domain/assertionSteps";
import { getDivinationCategories } from "../../../constants/divinationCategory";

// 典籍类型 → 占断方法（内置映射；动态方法名直接用自身）
const CATEGORY_METHOD: Record<string, string> = {
  梅花: "meihua",
  六爻: "zhouyi",
  奇门: "qimen",
};

const DuanyuSetting = () => {
  const { t } = useTranslation();
  const categories = getDivinationCategories();
  const [category, setCategory] = useState(categories[0]?.name || "梅花");
  const methodId = CATEGORY_METHOD[category] || category;
  const [steps, setSteps] = useState<AssertionStep[]>(() => getSteps(methodId));
  const [newBookName, setNewBookName] = useState("");
  const [newBookPriority, setNewBookPriority] = useState("1");

  const switchCategory = (cat: string) => {
    setCategory(cat);
    setSteps(getSteps(CATEGORY_METHOD[cat] || cat));
  };

  const updateStep = (index: number, patch: Partial<AssertionStep>) => {
    setSteps(steps.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addBookRef = (index: number) => {
    const name = newBookName.trim();
    if (!name) return;
    const step = steps[index];
    const bookRefs = [
      ...step.bookRefs,
      { book: name, priority: Number(newBookPriority) || 1 },
    ];
    updateStep(index, { bookRefs });
    setNewBookName("");
    setNewBookPriority("1");
  };

  const removeBookRef = (stepIndex: number, refIndex: number) => {
    const step = steps[stepIndex];
    updateStep(stepIndex, {
      bookRefs: step.bookRefs.filter((_, i) => i !== refIndex),
    });
  };

  const save = () => {
    saveSteps(methodId, steps);
    toast.success(t("Change successful"));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "32px",
    padding: "0 8px",
    borderRadius: "6px",
    border: "1px solid rgba(0,0,0,0.15)",
  };

  return (
    <>
      <div className="setting-dialog-new-title">
        <Trans>Divination category</Trans>
      </div>
      <select
        value={category}
        onChange={(e) => switchCategory(e.target.value)}
        className="lang-setting-dropdown"
      >
        {categories.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {steps.map((step, index) => (
        <div
          key={step.id}
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "12px",
            opacity: step.enabled ? 1 : 0.55,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={step.enabled}
              onChange={(e) => updateStep(index, { enabled: e.target.checked })}
            />
            <span style={{ fontWeight: 600, fontSize: "15px" }}>
              {step.name}
            </span>
            <span style={{ marginLeft: "auto", fontSize: "13px" }}>
              {t("Weight")}
            </span>
            <input
              type="number"
              value={step.weight}
              onChange={(e) =>
                updateStep(index, { weight: Number(e.target.value) })
              }
              style={{ width: "60px", ...inputStyle }}
            />
          </div>

          <div style={{ marginTop: "8px" }}>
            <input
              value={step.basis}
              placeholder={t("Basis")}
              onChange={(e) => updateStep(index, { basis: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: "8px" }}>
            {step.bookRefs.map((ref, ri) => (
              <div
                key={ri}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "3px 0",
                  fontSize: "13px",
                }}
              >
                <span style={{ flex: 1 }}>{ref.book}</span>
                <span style={{ color: "#888" }}>
                  {t("Priority")}: {ref.priority}
                </span>
                <span
                  style={{ cursor: "pointer", color: "#d9534f" }}
                  onClick={() => removeBookRef(index, ri)}
                >
                  {t("Delete")}
                </span>
              </div>
            ))}
            <div
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <input
                value={newBookName}
                placeholder={t("Book name")}
                onChange={(e) => setNewBookName(e.target.value)}
                style={{ ...inputStyle, width: "50%" }}
              />
              <input
                type="number"
                value={newBookPriority}
                placeholder={t("Priority")}
                onChange={(e) => setNewBookPriority(e.target.value)}
                style={{ ...inputStyle, width: "80px" }}
              />
              <span
                style={{
                  cursor: "pointer",
                  color: "#0078d4",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
                onClick={() => addBookRef(index)}
              >
                {t("Add")}
              </span>
            </div>
          </div>

          <div style={{ marginTop: "8px" }}>
            <textarea
              value={step.code}
              placeholder="function stepLogic(step, findings) { return null; }"
              onChange={(e) => updateStep(index, { code: e.target.value })}
              style={{
                width: "100%",
                height: "80px",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid rgba(0,0,0,0.15)",
                fontFamily: "monospace",
                fontSize: "12px",
                resize: "vertical",
              }}
            />
          </div>
        </div>
      ))}

      <div style={{ marginTop: "16px" }}>
        <span
          style={{
            cursor: "pointer",
            fontSize: "14px",
            color: "#0078d4",
            whiteSpace: "nowrap",
          }}
          onClick={save}
        >
          {t("Save")}
        </span>
      </div>
    </>
  );
};

export default DuanyuSetting;
