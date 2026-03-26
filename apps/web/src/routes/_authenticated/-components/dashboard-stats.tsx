import { AlertTriangle, DollarSign, Package, Warehouse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  totalModels: number;
  totalUnits: number;
  inventoryValue: number;
  lowStockCount: number;
}

export function DashboardStats({
  totalModels,
  totalUnits,
  inventoryValue,
  lowStockCount,
}: DashboardStatsProps) {
  const stats = [
    { icon: <Package className="size-8 text-blue-500" />, value: totalModels, label: "Shoe Models" },
    { icon: <Warehouse className="size-8 text-green-500" />, value: totalUnits.toLocaleString(), label: "Units in Stock" },
    { icon: <DollarSign className="size-8 text-yellow-500" />, value: `$${inventoryValue.toLocaleString()}`, label: "Inventory Value" },
    { icon: <AlertTriangle className="size-8 text-red-500" />, value: lowStockCount, label: "Low Stock Alerts" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ icon, value, label }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-3 p-3">
            {icon}
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
