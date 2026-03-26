import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
import { TableCell, TableRow } from "@/components/ui/table";
import type { Shoe } from "@/lib/api";

interface ShoeTableRowProps {
  shoe: Shoe;
  onDelete: (shoe: Shoe) => void;
}

export function ShoeTableRow({ shoe, onDelete }: ShoeTableRowProps) {
  const isOut = shoe.quantity === 0;
  const isLow = shoe.quantity <= shoe.minStockAlert;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{shoe.name}</TableCell>
        <TableCell>{shoe.brand}</TableCell>
        <TableCell>{shoe.category}</TableCell>
        <TableCell>{shoe.size}</TableCell>
        <TableCell>{shoe.color}</TableCell>
        <TableCell className="text-muted-foreground">{shoe.sku}</TableCell>
        <TableCell className="text-right">${shoe.costPrice}</TableCell>
        <TableCell className="text-right">${shoe.sellPrice}</TableCell>
        <TableCell>
          <Badge variant={isOut ? "destructive" : isLow ? "warning" : "success"}>
            {isOut ? t("shoes.stock.out") : isLow ? t("shoes.stock.low", { count: shoe.quantity }) : shoe.quantity}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-0.5">
            <Link to="/shoes/$shoeId" params={{ shoeId: shoe.id }}>
              <Button variant="ghost" size="icon-sm">
                <Eye className="size-3.5" />
              </Button>
            </Link>
            <Link to="/shoes/$shoeId/edit" params={{ shoeId: shoe.id }}>
              <Button variant="ghost" size="icon-sm">
                <Pencil className="size-3.5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)}>
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("shoeDetail.deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("shoeDetail.deleteDialog.description", { name: shoe.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                onDelete(shoe);
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
