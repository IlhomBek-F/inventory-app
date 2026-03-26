import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/lib/api";

interface LowStockListProps {
  items: DashboardData["lowStock"];
}

export function LowStockList({ items }: LowStockListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        {items.map((item) => (
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
  );
}
