import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Trans } from "react-i18next";
import toast from "react-hot-toast";
import {
  getCustomMethods,
  saveCustomMethod,
  removeCustomMethod,
  CustomMethod,
} from "../../../divination/custom/registry";
import {
  getDivinationCategories,
  setDivinationCategories,
} from "../../../constants/divinationCategory";

const PaipanSetting = () => {
  const { t } = useTranslation();
  const [customMethods, setCustomMethods] = useState<CustomMethod[]>(() =>
    getCustomMethods()
  );
  const [newMethodName, setNewMethodName] = useState("");
  const [newMethodCode, setNewMethodCode] = useState("");

  const addCustomMethod = () => {
    const name = newMethodName.trim();
    if (!name || !newMethodCode.trim()) {
      toast(t("Shelf Title is Empty"));
      return;
    }
    const method: CustomMethod = {
      id: `custom-${Date.now()}`,
      name,
      code: newMethodCode.trim(),
    };
    saveCustomMethod(method);
    // 同步加入典籍类型列表，供侧边栏下拉选择
    const cats = getDivinationCategories();
    if (!cats.find((c) => c.name === name)) {
      setDivinationCategories([...cats, { name, pinyin: "", shelves: [] }]);
    }
    setCustomMethods(getCustomMethods());
    setNewMethodName("");
    setNewMethodCode("");
    toast.success(t("Change successful"));
  };
  const removeCustom = (id: string, name: string) => {
    removeCustomMethod(id);
    const cats = getDivinationCategories().filter((c) => c.name !== name);
    setDivinationCategories(cats);
    setCustomMethods(getCustomMethods());
  };

  return (
    <>
      <div className="setting-dialog-new-title">
        <Trans>Divination code</Trans>
      </div>
      {customMethods.map((m) => (
        <div
          key={m.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 0",
          }}
        >
          <span style={{ fontSize: "14px", flex: 1 }}>{m.name}</span>
          <span
            style={{
              cursor: "pointer",
              color: "#d9534f",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
            onClick={() => removeCustom(m.id, m.name)}
          >
            {t("Delete")}
          </span>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        <input
          value={newMethodName}
          placeholder={t("Category name")}
          onChange={(event) => setNewMethodName(event.target.value)}
          style={{
            width: "40%",
            height: "32px",
            padding: "0 8px",
            borderRadius: "6px",
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        />
        <textarea
          value={newMethodCode}
          placeholder="function run(options) { return { summary: '...' } }"
          onChange={(event) => setNewMethodCode(event.target.value)}
          style={{
            width: "100%",
            height: "120px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid rgba(0,0,0,0.15)",
            fontFamily: "monospace",
            fontSize: "12px",
            resize: "vertical",
          }}
        />
        <span
          style={{
            cursor: "pointer",
            fontSize: "14px",
            color: "#0078d4",
            whiteSpace: "nowrap",
          }}
          onClick={addCustomMethod}
        >
          {t("Add")}
        </span>
      </div>
    </>
  );
};

export default PaipanSetting;
