import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const costPrice = Number(shoe.costPrice);
  const sellPrice = Number(shoe.sellPrice);
  const profit = sellPrice - costPrice;
  const margin = sellPrice > 0 ? ((profit / sellPrice) * 100).toFixed(1) : "0.0";

  const fields = [
    [t("shoeDetail.fields.brand"), shoe.brand],
    [t("shoeDetail.fields.category"), shoe.category],
    [t("shoeDetail.fields.size"), shoe.size],
    [t("shoeDetail.fields.color"), shoe.color],
    [t("shoeDetail.fields.condition"), shoe.condition],
    [t("shoeDetail.fields.sku"), shoe.sku],
    [t("shoeDetail.fields.barcode"), shoe.barcode],
    [t("shoeDetail.fields.supplier"), shoe.supplier],
    [t("shoeDetail.fields.location"), shoe.location],
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("shoeDetail.details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
            {fields.map(([label, value]) => (
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
                <span className="text-muted-foreground text-sm">{t("shoeDetail.fields.description")}</span>
                <p className="mt-1 text-sm">{shoe.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("shoeDetail.pricing")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("shoeDetail.fields.costPrice")}</span>
              <span className="font-medium">${costPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("shoeDetail.fields.sellPrice")}</span>
              <span className="font-medium">${sellPrice}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("shoeDetail.fields.profit")}</span>
              <span className="font-medium text-green-600">
                ${profit} ({margin}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("shoeDetail.stock")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("shoeDetail.fields.currentStock")}</span>
              <Badge variant={isOutOfStock ? "destructive" : isLowStock ? "warning" : "success"}>
                {shoe.quantity}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("shoeDetail.fields.minAlert")}</span>
              <span className="font-medium">{shoe.minStockAlert}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("shoeDetail.fields.stockValue")}</span>
              <span className="font-medium">${shoe.quantity * costPrice}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
