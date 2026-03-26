import { Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
            {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="secondary" onClick={onAddMovement}>
            <Plus className="size-3.5" />
            Movement
          </Button>
          <Link to="/shoes/$shoeId/edit" params={{ shoeId }}>
            <Button size="sm" variant="outline">
              <Pencil className="size-3.5" /> Edit
            </Button>
          </Link>
          <Button size="sm" variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="size-3.5" /> Delete
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete shoe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{shoe.name}</span>? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onDelete();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
