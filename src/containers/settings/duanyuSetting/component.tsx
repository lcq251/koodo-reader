import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Trans } from "react-i18next";
import toast from "react-hot-toast";
import { getAssertionConfig } from "../../../divination/domain/assertion.js";

const DuanyuSetting = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<any>(() => getAssertionConfig());

  const update = (patch: any) => setConfig((prev: any) => ({ ...prev, ...patch }));

  const moveSource = (index: number, dir: number) => {
    const next = [...config.sourcePriority];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ sourcePriority: next });
  };

  const toggleDecisive = (level: string) => {
    const next = config.decisiveLevels.includes(level)
      ? config.decisiveLevels.filter((l: string) => l !== level)
      : [...config.decisiveLevels, level];
    update({ decisiveLevels: next });
  };

  const setVerdict = (key: string, val: string) => {
    update({ verdict: { ...config.verdict, [key]: val } });
  };

  const save = () => {
    const override = {
      sourcePriority: config.sourcePriority,
      decisiveLevels: config.decisiveLevels,
      verdict: config.verdict,
      conflictText: config.conflictText,
      noDecisiveText: config.noDecisiveText,
    };
    localStorage.setItem("assertionConfigOverride", JSON.stringify(override));
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
        <Trans>Assertion config</Trans>
      </div>

      <div className="setting-dialog-new-title" style={{ fontSize: "14px" }}>
        <Trans>Source priority</Trans>
      </div>
      {config.sourcePriority.map((level: string, index: number) => (
        <div
          key={level}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 0",
          }}
        >
          <span style={{ fontSize: "14px", flex: 1 }}>
            {index + 1}. {level}
          </span>
          <span
            style={{ cursor: "pointer", color: "#0078d4", fontSize: "14px" }}
            onClick={() => moveSource(index, -1)}
          >
            ↑
          </span>
          <span
            style={{ cursor: "pointer", color: "#0078d4", fontSize: "14px" }}
            onClick={() => moveSource(index, 1)}
          >
            ↓
          </span>
        </div>
      ))}

      <div className="setting-dialog-new-title" style={{ fontSize: "14px" }}>
        <Trans>Decisive levels</Trans>
      </div>
      {config.sourcePriority.map((level: string) => (
        <label
          key={level}
          style={{
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "3px 0",
          }}
        >
          <input
            type="checkbox"
            checked={config.decisiveLevels.includes(level)}
            onChange={() => toggleDecisive(level)}
          />
          {level}
        </label>
      ))}

      <div className="setting-dialog-new-title" style={{ fontSize: "14px" }}>
        <Trans>Verdict</Trans>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          value={config.verdict.positive}
          placeholder="吉"
          onChange={(e) => setVerdict("positive", e.target.value)}
          style={inputStyle}
        />
        <input
          value={config.verdict.negative}
          placeholder="凶"
          onChange={(e) => setVerdict("negative", e.target.value)}
          style={inputStyle}
        />
        <input
          value={config.verdict.neutral}
          placeholder="平"
          onChange={(e) => setVerdict("neutral", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div className="setting-dialog-new-title" style={{ fontSize: "14px" }}>
        <Trans>Conflict text</Trans>
      </div>
      <input
        value={config.conflictText}
        onChange={(e) => update({ conflictText: e.target.value })}
        style={inputStyle}
      />

      <div className="setting-dialog-new-title" style={{ fontSize: "14px" }}>
        <Trans>No decisive text</Trans>
      </div>
      <input
        value={config.noDecisiveText}
        onChange={(e) => update({ noDecisiveText: e.target.value })}
        style={inputStyle}
      />

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
