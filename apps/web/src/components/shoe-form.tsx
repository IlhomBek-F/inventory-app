import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

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
  const [shoe, setShoe] = useState<ShoeFormData>({ ...emptyShoe, ...initialData });

  const update = <K extends keyof ShoeFormData>(field: K, value: ShoeFormData[K]) => {
    setShoe((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(shoe);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" value={shoe.name} onChange={(e) => update("name", e.target.value)} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brand">Brand *</Label>
        <Input id="brand" value={shoe.brand} onChange={(e) => update("brand", e.target.value)} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Category *</Label>
        <Select value={shoe.category} onValueChange={(v) => update("category", v)}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Size *</Label>
        <Select value={shoe.size} onValueChange={(v) => update("size", v)}>
          <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
          <SelectContent>
            {sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="color">Color</Label>
        <Input id="color" value={shoe.color} onChange={(e) => update("color", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Condition</Label>
        <Select value={shoe.condition} onValueChange={(v) => update("condition", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {conditions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" value={shoe.sku} onChange={(e) => update("sku", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="barcode">Barcode</Label>
        <Input id="barcode" value={shoe.barcode} onChange={(e) => update("barcode", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="costPrice">Cost Price *</Label>
        <Input id="costPrice" type="number" min={0} step={0.01} value={shoe.costPrice || ""} onChange={(e) => update("costPrice", Number(e.target.value))} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sellPrice">Sell Price *</Label>
        <Input id="sellPrice" type="number" min={0} step={0.01} value={shoe.sellPrice || ""} onChange={(e) => update("sellPrice", Number(e.target.value))} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quantity">Quantity *</Label>
        <Input id="quantity" type="number" min={0} value={shoe.quantity || ""} onChange={(e) => update("quantity", Number(e.target.value))} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="minStockAlert">Min Stock Alert</Label>
        <Input id="minStockAlert" type="number" min={0} value={shoe.minStockAlert || ""} onChange={(e) => update("minStockAlert", Number(e.target.value))} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="supplier">Supplier</Label>
        <Input id="supplier" value={shoe.supplier} onChange={(e) => update("supplier", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="location">Warehouse / Location</Label>
        <Input id="location" value={shoe.location} onChange={(e) => update("location", e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={shoe.description} onChange={(e) => update("description", e.target.value)} rows={3} />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" value={shoe.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://..." />
        {shoe.imageUrl && (
          <img src={shoe.imageUrl} alt={shoe.name} className="w-24 h-24 object-cover rounded mt-1" />
        )}
      </div>

      <div className="md:col-span-2 flex gap-2 mt-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => history.back()}>
          <X className="size-3.5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
