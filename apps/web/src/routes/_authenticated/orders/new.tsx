import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Minus, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { api, type Shoe } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/orders/new")({
  loader: () => api.shoes.list(),
  component: NewOrderPage,
});

interface OrderItem {
  shoeId: string;
  quantity: number;
}

function NewOrderPage() {
  const { items: shoes } = Route.useLoaderData();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [type, setType] = useState<"sale" | "purchase">("sale");
  const [customerOrSupplier, setCustomerOrSupplier] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderItem[]>([{ shoeId: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableShoes = shoes.filter((s) => s.quantity > 0 || type === "purchase");

  const addItem = () => setItems((prev) => [...prev, { shoeId: "", quantity: 1 }]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const getShoe = (shoeId: string): Shoe | undefined =>
    shoes.find((s) => s.id === shoeId);

  const canSubmit =
    items.length > 0 &&
    items.every((item) => item.shoeId && item.quantity >= 1) &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await api.orders.create({
        type,
        customerOrSupplier: customerOrSupplier.trim() || undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({ shoeId: i.shoeId, quantity: i.quantity })),
      });
      navigate({ to: "/orders" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("orders.new.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("orders.new.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <Label>{t("orders.new.type")}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={type === "sale" ? "default" : "outline"}
                  onClick={() => setType("sale")}
                >
                  {t("orders.type.sale")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={type === "purchase" ? "default" : "outline"}
                  onClick={() => setType("purchase")}
                >
                  {t("orders.type.purchase")}
                </Button>
              </div>
            </div>

            {/* Customer / Supplier */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="customerOrSupplier">
                {type === "sale" ? t("orders.new.customer") : t("orders.new.supplier")}
              </Label>
              <Input
                id="customerOrSupplier"
                value={customerOrSupplier}
                onChange={(e) => setCustomerOrSupplier(e.target.value)}
                placeholder={
                  type === "sale"
                    ? t("orders.new.customerPlaceholder")
                    : t("orders.new.supplierPlaceholder")
                }
              />
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
              <Label>{t("orders.new.items")}</Label>
              {items.map((item, index) => {
                const shoe = getShoe(item.shoeId);
                return (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Select
                        value={item.shoeId}
                        onValueChange={(v) => updateItem(index, "shoeId", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("orders.new.selectShoe")} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableShoes.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} — {s.brand} (#{s.size})
                              {type === "sale" && (
                                <span className="ml-1 text-muted-foreground">
                                  [{s.quantity} {t("orders.new.inStock")}]
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {shoe && type === "sale" && item.quantity > shoe.quantity && (
                        <p className="text-xs text-destructive mt-0.5">
                          {t("orders.new.insufficientStock", { available: shoe.quantity })}
                        </p>
                      )}
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        min={1}
                        max={type === "sale" && shoe ? shoe.quantity : undefined}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                      />
                    </div>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 shrink-0"
                        onClick={() => removeItem(index)}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={addItem}
              >
                <Plus className="size-3.5" />
                {t("orders.new.addItem")}
              </Button>
            </div>

            {/* Summary */}
            {items.some((i) => i.shoeId) && (
              <div className="rounded-md border p-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {t("orders.new.summary")}
                </p>
                {items
                  .filter((i) => i.shoeId)
                  .map((item, index) => {
                    const shoe = getShoe(item.shoeId);
                    if (!shoe) return null;
                    const total = Number(shoe.sellPrice) * item.quantity;
                    return (
                      <div key={index} className="flex justify-between text-xs">
                        <span>
                          {shoe.name} × {item.quantity}
                        </span>
                        {type === "sale" && (
                          <Badge variant="outline" className="text-xs h-4">
                            ${total.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">{t("orders.new.notes")}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={t("orders.new.notesPlaceholder")}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" disabled={!canSubmit}>
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                {t("orders.new.submit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => history.back()}
              >
                <X className="size-3.5" />
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
