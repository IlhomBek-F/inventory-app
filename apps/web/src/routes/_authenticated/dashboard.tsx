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
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: () => api.dashboard.get(),
  component: DashboardPage,
});

function DashboardPage() {
  const { stats, lowStock, recentMovements } = Route.useLoaderData();
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
              <p className="text-xl font-bold">{stats.totalModels}</p>
              <p className="text-xs text-muted-foreground">Shoe Models</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <Warehouse className="size-8 text-green-500" />
            <div>
              <p className="text-xl font-bold">{stats.totalUnits.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Units in Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <DollarSign className="size-8 text-yellow-500" />
            <div>
              <p className="text-xl font-bold">${stats.inventoryValue.toLocaleString()}</p>
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
            {lowStock.map((item) => (
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
                    <span className="font-medium">{movement.shoeName}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {new Date(movement.createdAt).toLocaleDateString()}
                    </span>
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
