import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, History, List, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <Package className="size-12 text-primary" />
      <h1 className="text-3xl font-bold">ShoeStock</h1>
      <p className="text-muted-foreground">Shoe Inventory Management System</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 w-full max-w-3xl">
        <Card>
          <CardContent className="flex flex-col items-center text-center pt-4">
            <Package className="size-8 text-primary mb-2" />
            <h3 className="text-sm font-semibold">Track Inventory</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Full CRUD with sizes, brands, pricing, and stock levels
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center text-center pt-4">
            <BarChart3 className="size-8 text-primary mb-2" />
            <h3 className="text-sm font-semibold">Dashboard Analytics</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Total value, low stock alerts, and stock breakdowns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center text-center pt-4">
            <History className="size-8 text-primary mb-2" />
            <h3 className="text-sm font-semibold">Movement History</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Track every stock in, out, and adjustment
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 mt-4">
        <Link to="/dashboard">
          <Button size="sm">
            <ArrowRight className="size-3.5" />
            Go to Dashboard
          </Button>
        </Link>
        <Link to="/shoes">
          <Button variant="secondary" size="sm">
            <List className="size-3.5" />
            View Inventory
          </Button>
        </Link>
      </div>
    </div>
  );
}
