import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";

export interface ShoeFormData {
  name: string;
  brand: string;
  category: string;
  size: string;
  color: string;
  condition: string;
  sku: string;
  barcode: string;
  description: string;
  imageUrl: string;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  minStockAlert: number;
  supplier: string;
  location: string;
}

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
  "Sneakers", "Running", "Casual", "Formal", "Boots", "Sandals", "Skate", "Basketball", "Training", "Other",
];

const conditions = ["New", "Used - Like New", "Used - Good", "Used - Fair", "Refurbished"];

const sizes = Array.from({ length: 20 }, (_, i) => String(35 + i));

interface ShoeFormProps {
  initialData?: Partial<ShoeFormData>;
  onSubmit: (data: ShoeFormData) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function ShoeForm({ initialData, onSubmit, loading, submitLabel = "Save" }: ShoeFormProps) {
  const form = useForm({
    defaultValues: { ...emptyShoe, ...initialData } as ShoeFormData,
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      <form.Field name="name" validators={{ onChange: ({ value }) => !value ? "Name is required" : undefined }}>
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
            {field.state.meta.errors.length > 0 && <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>}
          </div>
        )}
      </form.Field>

      <form.Field name="brand" validators={{ onChange: ({ value }) => !value ? "Brand is required" : undefined }}>
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brand">Brand *</Label>
            <Input id="brand" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
            {field.state.meta.errors.length > 0 && <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>}
          </div>
        )}
      </form.Field>

      <form.Field name="category" validators={{ onChange: ({ value }) => !value ? "Category is required" : undefined }}>
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>Category *</Label>
            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>}
          </div>
        )}
      </form.Field>

      <form.Field name="size" validators={{ onChange: ({ value }) => !value ? "Size is required" : undefined }}>
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>Size *</Label>
            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
              <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
              <SelectContent>
                {sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>}
          </div>
        )}
      </form.Field>

      <form.Field name="color">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="color">Color</Label>
            <Input id="color" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="condition">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label>Condition</Label>
            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {conditions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      <form.Field name="sku">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="barcode">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="barcode">Barcode</Label>
            <Input id="barcode" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="costPrice" validators={{ onChange: ({ value }) => value < 0 ? "Must be positive" : undefined }}>
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="costPrice">Cost Price *</Label>
            <Input id="costPrice" type="number" min={0} step={0.01} value={field.state.value || ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(Number(e.target.value))} />
            {field.state.meta.errors.length > 0 && <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>}
          </div>
        )}
      </form.Field>

      <form.Field name="sellPrice" validators={{ onChange: ({ value }) => value < 0 ? "Must be positive" : undefined }}>
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sellPrice">Sell Price *</Label>
            <Input id="sellPrice" type="number" min={0} step={0.01} value={field.state.value || ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(Number(e.target.value))} />
            {field.state.meta.errors.length > 0 && <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>}
          </div>
        )}
      </form.Field>

      <form.Field name="quantity" validators={{ onChange: ({ value }) => value < 0 ? "Must be positive" : undefined }}>
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input id="quantity" type="number" min={0} value={field.state.value || ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(Number(e.target.value))} />
            {field.state.meta.errors.length > 0 && <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>}
          </div>
        )}
      </form.Field>

      <form.Field name="minStockAlert">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="minStockAlert">Min Stock Alert</Label>
            <Input id="minStockAlert" type="number" min={0} value={field.state.value || ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(Number(e.target.value))} />
          </div>
        )}
      </form.Field>

      <form.Field name="supplier">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="supplier">Supplier</Label>
            <Input id="supplier" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="location">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Warehouse / Location</Label>
            <Input id="location" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} rows={3} />
          </div>
        )}
      </form.Field>

      <form.Field name="imageUrl">
        {(field) => (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="imageUrl">Image URL</Label>
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
              {submitLabel}
            </Button>
          )}
        </form.Subscribe>
        <Button type="button" variant="outline" size="sm" onClick={() => history.back()}>
          <X className="size-3.5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
