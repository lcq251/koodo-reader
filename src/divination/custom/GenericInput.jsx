export default function GenericInput({ value, onChange }) {
  const v = value || {};
  const set = (k, val) => onChange({ ...v, [k]: val });
  return (
    <>
      <label className="f">公曆時間</label>
      <input
        type="datetime-local"
        value={v.date || "2024-06-15T10:00"}
        onChange={(e) => set("date", e.target.value)}
      />
    </>
  );
}
