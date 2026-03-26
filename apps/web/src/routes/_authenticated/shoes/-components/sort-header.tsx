import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortKey = "name" | "brand" | "category" | "size" | "costPrice" | "sellPrice" | "quantity";

interface SortHeaderProps {
  label: string;
  field: SortKey;
  onSort: (key: SortKey) => void;
}

export function SortHeader({ label, field, onSort }: SortHeaderProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
      onClick={() => onSort(field)}
    >
      {label}
      <ArrowUpDown className="size-3" />
    </Button>
  );
}

export type { SortKey };
