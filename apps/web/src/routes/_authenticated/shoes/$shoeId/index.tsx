import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { movementSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/shoes/$shoeId/")({
  component: ShoeDetailPage,
});

// Mock data
const mockShoe = {
  id: "1",
  name: "Air Max 90",
  brand: "Nike",
  category: "Sneakers",
  size: "42",
  color: "White/Red",
  condition: "New",
  sku: "NK-AM90-42",
  barcode: "1234567890123",
  description: "Classic Air Max 90 sneaker with visible air unit. Iconic design since 1990.",
  costPrice: 80,
  sellPrice: 130,
  quantity: 2,
  minStockAlert: 5,
  supplier: "Nike Direct",
  location: "Warehouse A",
  createdAt: "2026-03-01",
  updatedAt: "2026-03-16",
};

const mockMovements = [
  {
    id: "1",
    type: "in",
    quantity: 50,
    reason: "Initial stock",
    createdAt: "2026-03-01",
    user: "Admin",
  },
  {
    id: "2",
    type: "out",
    quantity: 20,
    reason: "Store transfer",
    createdAt: "2026-03-05",
    user: "Admin",
  },
  {
    id: "3",
    type: "out",
    quantity: 15,
    reason: "Online orders",
    createdAt: "2026-03-10",
    user: "Admin",
  },
  {
    id: "4",
    type: "adjustment",
    quantity: -3,
    reason: "Damaged items",
    createdAt: "2026-03-12",
    user: "Admin",
  },
  {
    id: "5",
    type: "out",
    quantity: 10,
    reason: "Retail sales",
    createdAt: "2026-03-15",
    user: "Admin",
  },
];

const movementTypes = [
  { label: "Stock In", value: "in" },
  { label: "Stock Out", value: "out" },
  { label: "Adjustment", value: "adjustment" },
];

function ShoeDetailPage() {
  const { shoeId } = Route.useParams();
  const [showMovementDialog, setShowMovementDialog] = useState(false);

  const isLowStock = mockShoe.quantity <= mockShoe.minStockAlert;
  const isOutOfStock = mockShoe.quantity === 0;
  const profit = mockShoe.sellPrice - mockShoe.costPrice;
  const margin = ((profit / mockShoe.sellPrice) * 100).toFixed(1);

  const movementForm = useForm({
    defaultValues: { type: "in" as "in" | "out" | "adjustment", quantity: 0, reason: "" },
    validators: {
      onChange: movementSchema,
    },
    onSubmit: ({ value }) => {
      setShowMovementDialog(false);
      movementForm.reset();
    },
  });

  return (
    <div className="flex flex-col gap-3 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/shoes">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">{mockShoe.name}</h1>
          <Badge variant={isOutOfStock ? "destructive" : isLowStock ? "warning" : "success"}>
            {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="secondary" onClick={() => setShowMovementDialog(true)}>
            <Plus className="size-3.5" />
            Movement
          </Button>
          <Link to="/shoes/$shoeId/edit" params={{ shoeId }}>
            <Button size="sm" variant="outline">
              <Pencil className="size-3.5" /> Edit
            </Button>
          </Link>
          <Button size="sm" variant="destructive">
            <Trash2 className="size-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
              <div>
                <span className="text-muted-foreground">Brand</span>
                <div className="font-medium">{mockShoe.brand}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Category</span>
                <div className="font-medium">{mockShoe.category}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Size</span>
                <div className="font-medium">{mockShoe.size}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Color</span>
                <div className="font-medium">{mockShoe.color}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Condition</span>
                <div className="font-medium">{mockShoe.condition}</div>
              </div>
              <div>
                <span className="text-muted-foreground">SKU</span>
                <div className="font-medium">{mockShoe.sku}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Barcode</span>
                <div className="font-medium">{mockShoe.barcode}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Supplier</span>
                <div className="font-medium">{mockShoe.supplier}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Location</span>
                <div className="font-medium">{mockShoe.location}</div>
              </div>
            </div>
            {mockShoe.description && (
              <>
                <Separator className="my-3" />
                <div>
                  <span className="text-muted-foreground text-sm">Description</span>
                  <p className="mt-1 text-sm">{mockShoe.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost Price</span>
                <span className="font-medium">${mockShoe.costPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sell Price</span>
                <span className="font-medium">${mockShoe.sellPrice}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit</span>
                <span className="font-medium text-green-600">
                  ${profit} ({margin}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Stock</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Stock</span>
                <Badge variant={isOutOfStock ? "destructive" : isLowStock ? "warning" : "success"}>
                  {mockShoe.quantity}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min Alert</span>
                <span className="font-medium">{mockShoe.minStockAlert}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock Value</span>
                <span className="font-medium">${mockShoe.quantity * mockShoe.costPrice}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stock Movement History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Stock Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Type</TableHead>
                <TableHead className="w-20">Qty</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="w-20">User</TableHead>
                <TableHead className="w-24">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMovements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Badge
                      variant={
                        m.type === "in" ? "success" : m.type === "out" ? "destructive" : "warning"
                      }
                    >
                      {m.type === "in" ? "IN" : m.type === "out" ? "OUT" : "ADJ"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={m.type === "in" ? "text-green-600" : "text-red-600"}>
                      {m.type === "in" ? "+" : m.quantity < 0 ? "" : "-"}
                      {Math.abs(m.quantity)}
                    </span>
                  </TableCell>
                  <TableCell>{m.reason}</TableCell>
                  <TableCell>{m.user}</TableCell>
                  <TableCell>{m.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Movement Dialog */}
      <Dialog open={showMovementDialog} onOpenChange={setShowMovementDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Record Stock Movement</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              movementForm.handleSubmit();
            }}
            className="flex flex-col gap-3"
          >
            <movementForm.Field name="type">
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
            </movementForm.Field>
            <movementForm.Field name="quantity">
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
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </movementForm.Field>
            <movementForm.Field name="reason">
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
            </movementForm.Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowMovementDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                <Save className="size-3.5" /> Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
