import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/lib/api";

interface RecentMovementsListProps {
  movements: DashboardData["recentMovements"];
}

export function RecentMovementsList({ movements }: RecentMovementsListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Recent Stock Movements</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        {movements.map((movement) => (
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
  );
}
