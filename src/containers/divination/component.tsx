import { useTranslation } from "react-i18next";

const DivinationPage = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        fontSize: "16px",
        color: "inherit",
      }}
    >
      {t("Divination")}
    </div>
  );
};

export default DivinationPage;
