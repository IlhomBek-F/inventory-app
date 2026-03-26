import { Link } from "@tanstack/react-router";
import { Download, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShoesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onExportCSV: () => void;
}

export function ShoesToolbar({ search, onSearchChange, onExportCSV }: ShoesToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-2">
        <Link to="/shoes/new">
          <Button size="sm">
            <Plus className="size-3.5" />
            {t("shoes.addShoe")}
          </Button>
        </Link>
        <Button variant="secondary" size="sm" onClick={onExportCSV}>
          <Download className="size-3.5" />
          {t("shoes.exportCsv")}
        </Button>
      </div>
      <div className="relative w-64">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("shoes.searchPlaceholder")}
          className="pl-8 h-8 text-xs"
        />
      </div>
    </div>
  );
}
