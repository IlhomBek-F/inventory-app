import { useForm } from "@tanstack/react-form";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { movementSchema } from "@/lib/schemas";

const movementTypes = [
  { label: "Stock In", value: "in" },
  { label: "Stock Out", value: "out" },
  { label: "Adjustment", value: "adjustment" },
];

interface AddMovementDialogProps {
  shoeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddMovementDialog({
  shoeId,
  open,
  onOpenChange,
  onSuccess,
}: AddMovementDialogProps) {
  const form = useForm({
    defaultValues: { type: "in" as "in" | "out" | "adjustment", quantity: 0, reason: "" },
    validators: { onChange: movementSchema },
    onSubmit: async ({ value }) => {
      await api.shoes.addMovement(shoeId, value);
      onOpenChange(false);
      form.reset();
      onSuccess();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Record Stock Movement</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-3"
        >
          <form.Field name="type">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label>Movement Type</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as "in" | "out" | "adjustment")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {movementTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Field name="quantity">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]?.message}</p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="reason">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <Label>Reason</Label>
                <Textarea
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </form.Field>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <Save className="size-3.5" /> Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
