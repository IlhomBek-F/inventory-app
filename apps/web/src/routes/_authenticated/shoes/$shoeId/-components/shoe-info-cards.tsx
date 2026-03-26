import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Shoe } from "@/lib/api";

interface ShoeInfoCardsProps {
  shoe: Shoe;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export function ShoeInfoCards({ shoe, isOutOfStock, isLowStock }: ShoeInfoCardsProps) {
  const costPrice = Number(shoe.costPrice);
  const sellPrice = Number(shoe.sellPrice);
  const profit = sellPrice - costPrice;
  const margin = sellPrice > 0 ? ((profit / sellPrice) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
            {[
              ["Brand", shoe.brand],
              ["Category", shoe.category],
              ["Size", shoe.size],
              ["Color", shoe.color],
              ["Condition", shoe.condition],
              ["SKU", shoe.sku],
              ["Barcode", shoe.barcode],
              ["Supplier", shoe.supplier],
              ["Location", shoe.location],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="text-muted-foreground">{label}</span>
                <div className="font-medium">{value}</div>
              </div>
            ))}
          </div>
          {shoe.description && (
            <>
              <Separator className="my-3" />
              <div>
                <span className="text-muted-foreground text-sm">Description</span>
                <p className="mt-1 text-sm">{shoe.description}</p>
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
              <span className="font-medium">${costPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sell Price</span>
              <span className="font-medium">${sellPrice}</span>
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
                {shoe.quantity}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Min Alert</span>
              <span className="font-medium">{shoe.minStockAlert}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stock Value</span>
              <span className="font-medium">${shoe.quantity * costPrice}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
