import { useForm } from "@tanstack/react-form";
import { Loader2, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
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
import { type ShoeFormData, shoeSchema } from "@/lib/schemas";

export type { ShoeFormData };

const emptyShoe: ShoeFormData = {
  name: "",
  brand: "",
  category: "",
  size: "",
  color: "",
  condition: "New",
  sku: "",
  barcode: "",
  description: "",
  imageUrl: "",
  costPrice: 0,
  sellPrice: 0,
  quantity: 0,
  minStockAlert: 5,
  supplier: "",
  location: "",
};

const categories = [
  "Sneakers",
  "Running",
  "Casual",
  "Formal",
  "Boots",
  "Sandals",
  "Skate",
  "Basketball",
  "Training",
  "Other",
];

const conditions = ["New", "Used - Like New", "Used - Good", "Used - Fair", "Refurbished"];

const sizes = Array.from({ length: 20 }, (_, i) => String(35 + i));

interface ShoeFormProps {
  initialData?: Partial<ShoeFormData>;
  onSubmit: (data: ShoeFormData) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function ShoeForm({
  initialData,
  onSubmit,
  loading,
  submitLabel,
}: ShoeFormProps) {
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: { ...emptyShoe, ...initialData } as ShoeFormData,
    validators: { onChange: shoeSchema },
    onSubmit: ({ value }) => { onSubmit(value); },
  });

  const required = " *";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      <form.Field name="name">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">{t("shoeForm.fields.name")}{required}</Label>
            <Input id="name" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="brand">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brand">{t("shoeForm.fields.brand")}{required}</Label>
            <Input id="brand" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="category">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>{t("shoeForm.fields.category")}{required}</Label>
            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("shoeForm.placeholders.selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="size">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>{t("shoeForm.fields.size")}{required}</Label>
            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("shoeForm.placeholders.selectSize")} />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="color">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="color">{t("shoeForm.fields.color")}</Label>
            <Input id="color" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="condition">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>{t("shoeForm.fields.condition")}</Label>
            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {conditions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      <form.Field name="sku">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sku">{t("shoeForm.fields.sku")}</Label>
            <Input id="sku" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="barcode">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="barcode">{t("shoeForm.fields.barcode")}</Label>
            <Input id="barcode" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="costPrice">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="costPrice">{t("shoeForm.fields.costPrice")}{required}</Label>
            <Input id="costPrice" type="number" min={0} step={0.01} value={field.state.value || ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(Number(e.target.value))} />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="sellPrice">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sellPrice">{t("shoeForm.fields.sellPrice")}{required}</Label>
            <Input id="sellPrice" type="number" min={0} step={0.01} value={field.state.value || ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(Number(e.target.value))} />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="quantity">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quantity">{t("shoeForm.fields.quantity")}{required}</Label>
            <Input id="quantity" type="number" min={0} value={field.state.value || ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(Number(e.target.value))} />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-destructive">{field.state.meta.errors[0]?.message}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="minStockAlert">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="minStockAlert">{t("shoeForm.fields.minStockAlert")}</Label>
            <Input id="minStockAlert" type="number" min={0} value={field.state.value || ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(Number(e.target.value))} />
          </div>
        )}
      </form.Field>

      <form.Field name="supplier">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="supplier">{t("shoeForm.fields.supplier")}</Label>
            <Input id="supplier" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="location">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">{t("shoeForm.fields.location")}</Label>
            <Input id="location" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="description">{t("shoeForm.fields.description")}</Label>
            <Textarea id="description" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} rows={3} />
          </div>
        )}
      </form.Field>

      <form.Field name="imageUrl">
        {(field) => (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="imageUrl">{t("shoeForm.fields.imageUrl")}</Label>
            <Input id="imageUrl" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="https://..." />
            {field.state.value && (
              <img src={field.state.value} alt="shoe" className="w-24 h-24 object-cover rounded mt-1" />
            )}
          </div>
        )}
      </form.Field>

      <div className="md:col-span-2 flex gap-2 mt-2">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" size="sm" disabled={!canSubmit || loading || isSubmitting}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              {submitLabel ?? t("shoeForm.save")}
            </Button>
          )}
        </form.Subscribe>
        <Button type="button" variant="outline" size="sm" onClick={() => history.back()}>
          <X className="size-3.5" />
          {t("shoeForm.cancel")}
        </Button>
      </div>
    </form>
  );
}
