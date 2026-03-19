import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  DollarSign,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Warehouse,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

// Mock data — will be replaced with API calls
const stats = {
  totalShoes: 248,
  totalStock: 1842,
  totalValue: 156320,
  lowStockCount: 12,
};

const lowStockItems = [
  { id: "1", name: "Air Max 90", brand: "Nike", size: "42", quantity: 2, minStockAlert: 5 },
  { id: "2", name: "Classic Leather", brand: "Reebok", size: "40", quantity: 1, minStockAlert: 3 },
  { id: "3", name: "Stan Smith", brand: "Adidas", size: "43", quantity: 3, minStockAlert: 5 },
  { id: "4", name: "Old Skool", brand: "Vans", size: "41", quantity: 0, minStockAlert: 3 },
];

const recentMovements = [
  { id: "1", shoe: "Air Force 1", type: "in", quantity: 50, date: "2026-03-16" },
  { id: "2", shoe: "Ultra Boost", type: "out", quantity: 12, date: "2026-03-15" },
  { id: "3", shoe: "Chuck Taylor", type: "adjustment", quantity: -3, date: "2026-03-15" },
  { id: "4", shoe: "Air Max 90", type: "in", quantity: 24, date: "2026-03-14" },
  { id: "5", shoe: "Classic Leather", type: "out", quantity: 8, date: "2026-03-14" },
];

function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <Link to="/shoes/new">
          <Button size="sm">
            <Plus className="size-3.5" />
            Add Shoe
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <Package className="size-8 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{stats.totalShoes}</p>
              <p className="text-xs text-muted-foreground">Shoe Models</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <Warehouse className="size-8 text-green-500" />
            <div>
              <p className="text-xl font-bold">{stats.totalStock.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Units in Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <DollarSign className="size-8 text-yellow-500" />
            <div>
              <p className="text-xl font-bold">${stats.totalValue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Inventory Value</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <AlertTriangle className="size-8 text-red-500" />
            <div>
              <p className="text-xl font-bold">{stats.lowStockCount}</p>
              <p className="text-xs text-muted-foreground">Low Stock Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50 text-sm"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    {item.brand} · {item.size}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={item.quantity === 0 ? "destructive" : "warning"}>
                    {item.quantity} left
                  </Badge>
                  <Link to="/shoes/$shoeId" params={{ shoeId: item.id }}>
                    <Button variant="ghost" size="icon-sm">
                      <Eye className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {recentMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50 text-sm"
              >
                <div className="flex items-center gap-2">
                  {movement.type === "in" ? (
                    <ArrowDown className="size-3.5 text-green-500" />
                  ) : movement.type === "out" ? (
                    <ArrowUp className="size-3.5 text-red-500" />
                  ) : (
                    <RefreshCw className="size-3.5 text-yellow-500" />
                  )}
                  <div>
                    <span className="font-medium">{movement.shoe}</span>
                    <span className="text-xs text-muted-foreground ml-1">{movement.date}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    movement.type === "in"
                      ? "success"
                      : movement.type === "out"
                        ? "destructive"
                        : "warning"
                  }
                >
                  {movement.type === "out" ? "-" : "+"}
                  {Math.abs(movement.quantity)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
