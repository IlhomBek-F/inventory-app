import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isUz = i18n.language === "uz";

  const toggle = () => {
    const next = isUz ? "en" : "uz";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  return (
    <Button variant="ghost" size="sm" className="h-8 text-xs font-medium w-10" onClick={toggle}>
      {isUz ? "EN" : "UZ"}
    </Button>
  );
}
