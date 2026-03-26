import { Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Shoe } from "@/lib/api";

interface ShoeDetailHeaderProps {
  shoe: Shoe;
  shoeId: string;
  isOutOfStock: boolean;
  isLowStock: boolean;
  onAddMovement: () => void;
  onDelete: () => void;
}

export function ShoeDetailHeader({
  shoe,
  shoeId,
  isOutOfStock,
  isLowStock,
  onAddMovement,
  onDelete,
}: ShoeDetailHeaderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { t } = useTranslation();

  const stockStatus = isOutOfStock
    ? t("shoeDetail.stockStatus.outOfStock")
    : isLowStock
      ? t("shoeDetail.stockStatus.lowStock")
      : t("shoeDetail.stockStatus.inStock");

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/shoes">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">{shoe.name}</h1>
          <Badge variant={isOutOfStock ? "destructive" : isLowStock ? "warning" : "success"}>
            {stockStatus}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="secondary" onClick={onAddMovement}>
            <Plus className="size-3.5" />
            {t("shoeDetail.movement")}
          </Button>
          <Link to="/shoes/$shoeId/edit" params={{ shoeId }}>
            <Button size="sm" variant="outline">
              <Pencil className="size-3.5" /> {t("common.edit")}
            </Button>
          </Link>
          <Button size="sm" variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="size-3.5" /> {t("common.delete")}
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("shoeDetail.deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("shoeDetail.deleteDialog.description", { name: shoe.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onDelete();
              }}
            >
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
