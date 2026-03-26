import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/orders/")({
  loader: () => api.orders.list(),
  component: OrdersPage,
});

function OrdersPage() {
  const { items: orders } = Route.useLoaderData();
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t("orders.title")}</h1>
        <Link to="/orders/new">
          <Button size="sm" className="h-8 text-xs">
            <Plus className="size-3.5" />
            {t("orders.newOrder")}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("orders.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <ShoppingCart className="size-8 opacity-30" />
              <p className="text-sm">{t("orders.noOrders")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">{t("orders.columns.type")}</TableHead>
                  <TableHead>{t("orders.columns.customerOrSupplier")}</TableHead>
                  <TableHead className="w-20">{t("orders.columns.items")}</TableHead>
                  <TableHead className="w-20">{t("orders.columns.totalQty")}</TableHead>
                  <TableHead className="w-28">{t("orders.columns.date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <Badge variant={o.type === "sale" ? "destructive" : "success"}>
                        {o.type === "sale" ? t("orders.type.sale") : t("orders.type.purchase")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {o.customerOrSupplier || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm">{o.itemCount}</TableCell>
                    <TableCell className="text-sm font-medium">
                      <span className={o.type === "sale" ? "text-red-600" : "text-green-600"}>
                        {o.type === "sale" ? "-" : "+"}
                        {o.totalQuantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
